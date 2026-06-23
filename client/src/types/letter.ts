export type LetterCategory = 'prison' | 'soldier' | 'beloved' | 'regular';
export type RecipientType = 'standard' | 'apo_fpo' | 'correctional';

export interface RecipientInfo {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  type: RecipientType;
  facilityName?: string;
  inmateId?: string;
}

export interface SenderInfo {
  name: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface LetterPricing {
  basePriceInCents: number;
  extrasPriceInCents: number;
  facilityFeeInCents: number;
  totalPriceInCents: number;
}

export interface LetterDocument {
  id: string;
  userId: string;
  currentStep: number;
  category: LetterCategory;
  subject: string;
  body: string;
  pageCount: number;
  extras: string[];
  recipient: RecipientInfo;
  sender: SenderInfo;
  pricing: LetterPricing;
  paymentStatus: 'draft' | 'processing' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus: 'unpaid' | 'pending_print' | 'printing' | 'shipped' | 'delivered' | 'returned';
  stripeSessionId?: string;
  createdAt?: any;
  updatedAt?: any;
}
