import express from "express";
import { authorize } from "../middleware/auth.middleware.js";
import {
  createSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
  getUpcomingRenewals
} from "../controllers/subscription.controller.js";

const subscriptionRouter = express.Router();

// ✅ Create subscription (authorized)
subscriptionRouter.post('/', authorize, createSubscription);

// ✅ Get all subscriptions (optional: restrict to admin)
subscriptionRouter.get('/', getAllSubscriptions);

// ✅ Get subscriptions of a specific user (must be before `/:id`)
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

// ✅ Get a single subscription by ID
subscriptionRouter.get('/:id', getSubscriptionById);

// ✅ Update a subscription
subscriptionRouter.put('/:id', authorize, updateSubscription);

// ✅ Cancel a subscription
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

// ✅ Delete a subscription
subscriptionRouter.delete('/:id', authorize, deleteSubscription);

// ✅ Get upcoming renewals
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

export default subscriptionRouter;
