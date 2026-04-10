const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { isAuthenticated } = require('../middleware/authMiddleware');

// POST /api/payment/create-intent
router.post('/create-intent', isAuthenticated, async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'inr',
      payment_method_types: ['card']
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
