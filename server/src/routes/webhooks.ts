import express from 'express';
import { stripe } from '../config/stripe.js';
import { ENV } from '../config/env.js';
import { db } from '../config/firebaseadmin.js';

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, ENV.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful one-time checkouts
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const userId = session.metadata.userId;
    const letterId = session.metadata.letterId;

    try {
      // 1. Log the receipt/payment under the user profile or an independent collection
      await db.collection('letters').doc(letterId).set({
        paymentStatus: 'paid',
        fulfillmentStatus: 'printing', // Moves letter to your fulfillment operations dashboard
        stripeSessionId: session.id,
        amountPaid: session.amount_total / 100, // Converts cents back to dollars for displays
        paidAt: new Date(),
      }, { merge: true });

      console.log(`✉️ Letter ${letterId} marked as PAID. Ready for print optimization routing.`);
    } catch (dbError) {
      console.error('❌ Firestore write failure on webhook handling:', dbError);
      return res.status(500).send('Database storage exception');
    }
  }

  res.json({ received: true });
});

export default router;