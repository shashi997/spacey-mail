export type LetterCategory = 'prison' | 'soldier' | 'beloved' | 'regular';
export type RecipientType = 'standard' | 'apo_fpo' | 'correctional';
export type PaymentStatus = 'draft' | 'processing' | 'paid' | 'failed' | 'refunded';
export type FulfillmentStatus = 'unpaid' | 'pending_print' | 'printing' | 'shipped' | 'delivered' | 'returned';

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
  id?: string;
  userId: string;
  currentStep: number;
  category: LetterCategory;
  body: string;
  bodyDelta?: any;
  paperColor?: string;
  pageCount: number;
  extras: string[];
  recipient: RecipientInfo;
  sender: SenderInfo;
  pricing: LetterPricing;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  stripeSessionId?: string;
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
}

export interface CreateLetterDto {
  category: LetterCategory;
  currentStep: number;
  body: string;
  bodyDelta?: any;
  paperColor?: string;
  extras: string[];
  recipient: RecipientInfo;
  sender: SenderInfo;
}

export interface UpdateLetterDto extends Partial<CreateLetterDto> {
  currentStep?: number;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  stripeSessionId?: string;
  pricing?: LetterPricing;
}
