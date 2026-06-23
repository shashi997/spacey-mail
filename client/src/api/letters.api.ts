import { api } from './client';
import { auth } from '@/config/firebase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface LetterResponse {
  id: string;
  userId: string;
  currentStep: number;
  category: 'prison' | 'soldier' | 'beloved' | 'regular';
  body: string;
  bodyDelta?: any;
  paperColor?: string;
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

  downloadPdf: async (letterId: string): Promise<void> => {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;
    const response = await fetch(`${API_BASE}/letters/${letterId}/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Failed to generate PDF' }));
      throw new Error(err.error || 'Failed to generate PDF');
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
  },
};
