import express from 'express';
import { stripe } from '../config/stripe.js';
import { ENV } from '../config/env.js';
import { db } from '../config/firebaseadmin.js';

const router = express.Router();
const PROCESSED_EVENTS_COLLECTION = 'processed_events';

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, ENV.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const eventId = event.id;

  try {
    // Idempotency check: skip if this event was already processed
    const alreadyProcessed = await db.collection(PROCESSED_EVENTS_COLLECTION).doc(eventId).get();
    if (alreadyProcessed.exists) {
      console.log(`Duplicate webhook event ${eventId} — skipping`);
      return res.json({ received: true, duplicate: true });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const userId: string | undefined = session.metadata?.userId;
      const letterId: string | undefined = session.metadata?.letterId;

      if (!userId || !letterId) {
        console.error('Webhook missing metadata userId or letterId');
        return res.status(400).send('Missing metadata');
      }

      const letterRef = db.collection('letters').doc(letterId);
      await letterRef.set({
        paymentStatus: 'paid',
        fulfillmentStatus: 'pending_print',
        stripeSessionId: session.id,
        amountPaid: session.amount_total / 100,
        paidAt: new Date(),
        updatedAt: new Date(),
      }, { merge: true });

      console.log(`Letter ${letterId} marked as PAID. Ready for print queue.`);
    }

    // Record event as processed for idempotency
    await db.collection(PROCESSED_EVENTS_COLLECTION).doc(eventId).set({
      type: event.type,
      processedAt: new Date(),
    });

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).send('Webhook processing failed');
  }
});

export default router;
