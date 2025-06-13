import { emailTemplates } from './email-template.js';
import dayjs from 'dayjs';
import transporter, { accountEmail } from '../config/nodemailer.js';

export const sendReminderEmail = async ({ to, type, subscription }) => {
    if (!to || !type) throw new Error('Missing required parameters');

    const template = emailTemplates.find((t) => t.label === type);
    if (!template) throw new Error('Invalid email type');

    const mailInfo = {
        userName: subscription.user?.name || 'User', // Fallback to 'User' if name is missing
        subscriptionName: subscription.name || 'Unknown Subscription',
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
        planName: subscription.name || 'Unknown Plan',
        price: `${subscription.currency || 'INR'} ${subscription.price || 0} (${subscription.frequency || 'unknown'})`,
        paymentMethod: subscription.paymentMethod || 'Unknown Method',
    };

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error; // Propagate the error to the caller
    }
};