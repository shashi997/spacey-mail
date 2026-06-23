import express from 'express';
import { stripe } from '../config/stripe.js';
import { ENV } from '../config/env.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { letterRepository } from '../repositories/letter.repository.js';
import { sendSuccess, sendError } from '../utils/api-response.js';
import { AppError } from '../middlewares/error.middleware.js';
import { checkoutLetterSchema } from '../validators/letter.schema.js';

const router = express.Router();

router.post('/create-letter-checkout', requireAuth, async (req, res, next) => {
  try {
    const { letterId } = req.body;
    const userId = req.user!.uid;

    if (!letterId) {
      sendError(res, 'MISSING_LETTER_ID', 'letterId is required', 400);
      return;
    }

    const letter = await letterRepository.findById(letterId);
    if (!letter) throw new AppError(404, 'LETTER_NOT_FOUND', 'Letter not found');
    if (letter.userId !== userId) throw new AppError(403, 'FORBIDDEN', 'Not your letter');

    // Validate the stored letter is complete enough for checkout
    const validationResult = checkoutLetterSchema.safeParse(letter);
    if (!validationResult.success) {
      const issues = validationResult.error.issues.map(
        (i) => `${i.path.join('.')}: ${i.message}`,
      );
      console.error('Checkout validation failed for letter', letterId, issues);
      sendError(res, 'INCOMPLETE_LETTER', issues.join('; '), 400);
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Physical Letter Print & Delivery',
              description: 'Physical Letter Print & Delivery',
            },
            unit_amount: letter.pricing.totalPriceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${ENV.CLIENT_URL}/dashboard?status=success&letterId=${letterId}`,
      cancel_url: `${ENV.CLIENT_URL}/letter/${letter.category}?step=4`,
      metadata: {
        userId,
        letterId,
      },
    });

    await letterRepository.update(letterId, {
      paymentStatus: 'processing',
      stripeSessionId: session.id,
    });

    sendSuccess(res, { url: session.url });
  } catch (error) {
    next(error);
  }
});

export default router;
