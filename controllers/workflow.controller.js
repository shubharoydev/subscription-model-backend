import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  console.log('Received subscriptionId:', subscriptionId);

  const subscription = await fetchSubscription(context, subscriptionId);
  if (!subscription) {
    console.error(`Subscription not found for ID: ${subscriptionId}`);
    return;
  }

  console.log('Fetched subscription:', subscription);

  if (subscription.status !== 'active') {
    console.log(`Subscription status is not active (status: ${subscription.status}). Stopping workflow.`);
    return;
  }

  const renewalDate = dayjs(subscription.renewalDate);
  console.log('Renewal date:', renewalDate.format());

  if (renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');
    console.log(`Checking reminder for ${daysBefore} days before: ${reminderDate.format()}`);

    if (reminderDate.isAfter(dayjs())) {
      let isFinalSleep = false;
      while (!isFinalSleep) {
        isFinalSleep = await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        if (!isFinalSleep) {
          console.log(`Intermediate sleep completed, checking if reminder date has been reached...`);
          if (dayjs().isSame(reminderDate, 'day')) {
            break; // If we've reached the reminder date, exit the loop
          }
        }
      }
    }

    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    const subscription = await Subscription.findById(subscriptionId).populate('userId', 'name email');
    console.log('Populated subscription.userId:', subscription?.userId);
    return subscription;
  });
};

const MAX_SLEEP_CHUNK_SECONDS = 604800 - 3600; // 7 days - 1 hour for safety

const sleepUntilReminder = async (context, label, targetDate) => {
  const now = dayjs();
  const targetTime = targetDate.valueOf();
  const currentTime = now.valueOf();
  const timeToTarget = targetTime - currentTime;

  console.log(`Sleeping until ${label} reminder at ${targetDate.toISOString()}`);
  console.log(`Time to target date: ${Math.floor(timeToTarget / 1000)} seconds`);

  if (timeToTarget <= MAX_SLEEP_CHUNK_SECONDS * 1000) {
    // If we're within our max chunk size, sleep directly to the target date
    await context.sleepUntil(label, targetDate.toDate());
    return true; // This was the final sleep segment
  }

  // Calculate intermediate sleep time (6 days from now)
  const intermediateTime = currentTime + (MAX_SLEEP_CHUNK_SECONDS * 1000);
  const intermediateDate = dayjs(intermediateTime);
  console.log(`Scheduling intermediate sleep until ${intermediateDate.toISOString()}`);
  await context.sleepUntil(label, intermediateDate.toDate());
  return false; // This was an intermediate sleep segment
};


const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    // Convert to plain object to avoid prototype loss
    const subscriptionPlain = JSON.parse(JSON.stringify(subscription));

    if (
      !subscriptionPlain.userId ||
      !subscriptionPlain.userId.email ||
      !subscriptionPlain.userId.name
    ) {
      console.error('Missing user information on subscription:', subscriptionPlain._id);
      console.error('subscription.userId:', subscriptionPlain.userId);
      return;
    }

    await sendReminderEmail({
      to: subscriptionPlain.userId.email,
      name: subscriptionPlain.userId.name,
      type: label,
      subscription: subscriptionPlain,
    });
  });
};
