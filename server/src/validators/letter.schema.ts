import { z } from 'zod';

// ─── Recipient: strict — letter must have a destination ───
const recipientInfoSchema = z.object({
  name: z.string().min(1, 'Recipient name is required').max(100),
  addressLine1: z.string().min(1, 'Address is required').max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().length(2, 'State must be a 2-letter code'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  type: z.enum(['standard', 'apo_fpo', 'correctional']),
  facilityName: z.string().max(200).optional(),
  inmateId: z.string().max(50).optional(),
}).refine(
  (data) => {
    if (data.type === 'correctional') return !!data.facilityName && !!data.inmateId;
    return true;
  },
  { message: 'Facility name and inmate ID are required for correctional mail' },
);

// ─── Sender: address fields are optional for draft saves ───
const senderInfoSchema = z.object({
  name: z.string().min(1, 'Sender name is required').max(100),
  email: z.string().email('Invalid email address'),
  addressLine1: z.string().max(200).default(''),
  city: z.string().max(100).default(''),
  state: z.string().max(2).default(''),
  zipCode: z.string().max(10).default(''),
});

// ─── Draft: used for save-in-progress (most fields lenient) ───
export const createLetterSchema = z.object({
  category: z.enum(['prison', 'soldier', 'beloved', 'regular']),
  currentStep: z.number().int().min(0).max(4).default(0),
  subject: z.string().max(200).default(''),
  body: z.string().max(10000).default(''),
  extras: z.array(z.enum(['photo', 'sticker', 'drawing', 'gift'])).max(10).default([]),
  recipient: recipientInfoSchema,
  sender: senderInfoSchema,
});

// ─── Checkout: strict validation before payment ───
export const checkoutLetterSchema = createLetterSchema.extend({
  subject: z.string().min(1, 'Subject is required').max(200),
  body: z.string().min(1, 'Letter body is required').max(10000),
  sender: senderInfoSchema.extend({
    addressLine1: z.string().min(1, 'Sender address is required').max(200),
    city: z.string().min(1, 'Sender city is required').max(100),
    state: z.string().length(2, 'Sender state must be a 2-letter code'),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid sender ZIP code'),
  }),
});

export type CreateLetterInput = z.infer<typeof createLetterSchema>;
