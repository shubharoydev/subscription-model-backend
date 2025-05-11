// routes/subscription.routes.js
import express from "express";
import { authorize } from "../middleware/auth.middleware.js";
import { createSubscription, getUserSubscriptions } from "../controllers/subscription.controller.js";
const subscriptionRouter = express.Router();

subscriptionRouter.get('/:id', (req, res) => {
  res.json({ title: 'Get subscription details' });
});

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', (req, res) => {
  res.json({ title: 'Update subscription' });
});

subscriptionRouter.delete('/:id', (req, res) => {
  res.json({ title: 'Delete subscription' });
});

subscriptionRouter.get('/user/:userId', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', (req, res) => {
  res.json({ title: 'Cancel subscription' });
});

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
  res.json({ title: 'Upcoming renewals' });
});

export default subscriptionRouter;
