import express from 'express';
import { stripe } from '../config/stripe.js';
import { ENV } from '../config/env.js';

const router = express.Router();

router.post('/create-letter-checkout', async (req, res) => {
  try {
    const { letterId, userId, totalPriceInCents, letterSummary } = req.body;

    // Create a transactional checkout session (mode: 'payment')
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Physical Letter Print & Delivery Service',
              description: letterSummary || 'Custom printed high-quality physical letter delivery.',
            },
            unit_amount: totalPriceInCents, // e.g., $4.50 must be sent as 450 (integer cents)
          },
          quantity: 1,
        },
      ],
      mode: 'payment', // <-- Crucial: ONE-TIME payment, not subscription
      success_url: `${ENV.CLIENT_URL}/dashboard?status=success&letterId=${letterId}`,
      cancel_url: `${ENV.CLIENT_URL}/checkout/review?letterId=${letterId}`,
      metadata: {
        userId,   // Links the transaction back to the user document
        letterId, // Links the transaction directly to the target letter document
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Session Creation Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;