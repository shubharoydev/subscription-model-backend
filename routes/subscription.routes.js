const express = require("express");

const subscriptionRouter = express.Router();

subscriptionRouter.get('/', (req, res) => {
  res.json({ title: 'Get all subscriptions' });
});

subscriptionRouter.get('/:id', (req, res) => {
  res.json({ title: 'Get subscription details' });
});

subscriptionRouter.post('/', (req, res) => {
  res.json({ title: 'Create subscription' });
});

subscriptionRouter.put('/:id', (req, res) => {
  res.json({ title: 'Update subscription' });
});

subscriptionRouter.delete('/:id', (req, res) => {
  res.json({ title: 'Delete subscription' });
});

subscriptionRouter.get('/user/:id', (req, res) => {
  res.json({ title: 'Get all subscriptions for user' });
});

subscriptionRouter.put('/:id/cancel', (req, res) => {
  res.json({ title: 'Cancel subscription' });
});

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
  res.json({ title: 'Upcoming renewals' });
});

module.exports = subscriptionRouter;
