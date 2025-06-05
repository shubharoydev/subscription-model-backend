import dotenv from 'dotenv';
dotenv.config();
import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';

const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            userId: req.user._id,
        });

        await workflowClient.trigger({
            url: `${process.env.SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription._id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        });

        return res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};

const getUserSubscriptions = async (req, res, next) => {
    try {
          console.log('req.user._id:', req.user?._id?.toString());
        console.log('req.params.userId:', req.params.userId);
        if (req.user._id.toString() !== req.params.userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not the owner of this account',
            });
        }

        const subscriptions = await Subscription.find({ userId: req.params.userId });

        res.status(200).json({
            success: true,
            data: subscriptions,
        });
    } catch (error) {
        next(error);
    }
};

// Get all subscriptions (admin or open list)
export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find().populate('userId', 'name email');
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

// Get subscription by ID
export const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// Update subscription by ID
export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    res.status(200).json({ success: true, message: 'Subscription updated', data: subscription });
  } catch (error) {
    next(error);
  }
};

// Delete subscription
export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }
    res.status(200).json({ success: true, message: 'Subscription deleted' });
  } catch (error) {
    next(error);
  }
};

// Cancel subscription (sets status to 'cancelled')
export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    res.status(200).json({ success: true, message: 'Subscription cancelled', data: subscription });
  } catch (error) {
    next(error);
  }
};

// Get upcoming renewals (within next 7 days)
export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const subscriptions = await Subscription.find({
      status: 'active',
      renewalDate: { $gte: today, $lte: nextWeek },
      userId: req.user._id, // Optional: restrict to logged-in user's renewals
    });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export { createSubscription, getUserSubscriptions };
