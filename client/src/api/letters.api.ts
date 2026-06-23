import { api } from './client';

export interface LetterResponse {
  id: string;
  userId: string;
  currentStep: number;
  category: 'prison' | 'soldier' | 'beloved' | 'regular';
  subject: string;
  body: string;
  pageCount: number;
  extras: string[];
  recipient: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    type: 'standard' | 'apo_fpo' | 'correctional';
    facilityName?: string;
    inmateId?: string;
  };
  sender: {
    name: string;
    email: string;
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
  };
  pricing: {
    basePriceInCents: number;
    extrasPriceInCents: number;
    facilityFeeInCents: number;
    totalPriceInCents: number;
  };
  paymentStatus: string;
  fulfillmentStatus: string;
  stripeSessionId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface CheckoutResponse {
  url: string;
}

export const lettersApi = {
  create: (data: Record<string, unknown>) =>
    api.post<LetterResponse>('/letters', data),

  list: () =>
    api.get<LetterResponse[]>('/letters'),

  getById: (id: string) =>
    api.get<LetterResponse>(`/letters/${id}`),

  update: (id: string, data: Record<string, unknown>) =>
    api.patch<LetterResponse>(`/letters/${id}`, data),

  createCheckout: (letterId: string) =>
    api.post<CheckoutResponse>('/create-letter-checkout', { letterId }),
};
