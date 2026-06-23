import { create } from 'zustand';
import { lettersApi } from '@/api/letters.api';
import type { RecipientInfo, SenderInfo, LetterPricing } from '@/types/letter';

export type Category = 'prison' | 'soldier' | 'beloved' | 'regular';

const VALID_CATEGORIES: readonly Category[] = ['prison', 'soldier', 'beloved', 'regular'];

export function isValidCategory(value: string): value is Category {
  return VALID_CATEGORIES.includes(value as Category);
}

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

function calculatePricing(body: string, extras: string[], recipientType: string): LetterPricing {
  let basePriceInCents = 299;
  const text = stripHtml(body);
  const pages = Math.ceil(text.length / 2500);
  if (pages > 1) basePriceInCents += (pages - 1) * 99;

  const extraPrices: Record<string, number> = {
    photo: 150, sticker: 75, drawing: 100, gift: 250,
  };
  const extrasPriceInCents = extras.reduce((sum, e) => sum + (extraPrices[e] ?? 0), 0);

  const facilityFeeInCents = recipientType === 'correctional' ? 50
    : recipientType === 'apo_fpo' ? 100 : 0;

  return {
    basePriceInCents,
    extrasPriceInCents,
    facilityFeeInCents,
    totalPriceInCents: basePriceInCents + extrasPriceInCents + facilityFeeInCents,
  };
}

interface LetterState {
  category: Category | null;
  currentStep: number;
  letterId: string | null;

  isSaving: boolean;

  body: string;
  bodyDelta: any;
  paperColor: string;

  extras: string[];

  recipient: RecipientInfo;
  sender: SenderInfo;

  pricing: LetterPricing;
  paymentStatus: string;
  fulfillmentStatus: string;

  setCategory: (cat: Category) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setLetterId: (id: string | null) => void;

  updateStep1: (data: { body?: string; bodyDelta?: any; paperColor?: string }) => void;
  updateStep2: (data: { extras?: string[] }) => void;
  updateStep3: (data: { recipient?: Partial<RecipientInfo>; sender?: Partial<SenderInfo> }) => void;

  recalculatePricing: () => void;

  saveToServer: () => Promise<string | null>;
  loadFromServer: (letterId: string) => Promise<void>;

  reset: () => void;
}

const defaultRecipient: RecipientInfo = {
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  type: 'standard',
  facilityName: '',
  inmateId: '',
};

const defaultSender: SenderInfo = {
  name: '',
  email: '',
  addressLine1: '',
  city: '',
  state: '',
  zipCode: '',
};

const defaultPricing: LetterPricing = {
  basePriceInCents: 299,
  extrasPriceInCents: 0,
  facilityFeeInCents: 0,
  totalPriceInCents: 299,
};

export const useLetterStore = create<LetterState>((set, get) => ({
  category: null,
  currentStep: 0,
  letterId: null,

  isSaving: false,

  body: '',
  bodyDelta: null,
  paperColor: 'white',

  extras: [],

  recipient: { ...defaultRecipient },
  sender: { ...defaultSender },

  pricing: { ...defaultPricing },
  paymentStatus: 'draft',
  fulfillmentStatus: 'unpaid',

  setCategory: (cat) => set({ category: cat }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 4),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  goToStep: (step) => set({ currentStep: Math.min(Math.max(step, 0), 4) }),

  setLetterId: (id) => set({ letterId: id }),

  updateStep1: (data) =>
    set((state) => {
      const body = data.body ?? state.body;
      const bodyDelta = data.bodyDelta !== undefined ? data.bodyDelta : state.bodyDelta;
      const paperColor = data.paperColor ?? state.paperColor;
      const pricing = calculatePricing(body, state.extras, state.recipient.type);
      return { body, bodyDelta, paperColor, pricing };
    }),

  updateStep2: (data) =>
    set((state) => {
      const extras = data.extras ?? state.extras;
      const pricing = calculatePricing(state.body, extras, state.recipient.type);
      return { extras, pricing };
    }),

  updateStep3: (data) =>
    set((state) => {
      const recipient = data.recipient
        ? { ...state.recipient, ...data.recipient }
        : state.recipient;
      const sender = data.sender
        ? { ...state.sender, ...data.sender }
        : state.sender;
      const pricing = calculatePricing(state.body, state.extras, recipient.type);
      return { recipient, sender, pricing };
    }),

  recalculatePricing: () =>
    set((state) => {
      const pricing = calculatePricing(state.body, state.extras, state.recipient.type);
      return { pricing };
    }),

  saveToServer: async () => {
    const state = get();
    set({ isSaving: true });

    const letterData = {
      category: state.category,
      currentStep: state.currentStep,
      body: state.body,
      bodyDelta: state.bodyDelta,
      paperColor: state.paperColor,
      extras: state.extras,
      recipient: state.recipient,
      sender: state.sender,
    };

    try {
      if (state.letterId) {
        const res = await lettersApi.update(state.letterId, letterData);
        if (!res.success) throw new Error(res.error.message);
        set({ isSaving: false });
        return state.letterId;
      } else {
        const res = await lettersApi.create(letterData);
        if (!res.success) throw new Error(res.error.message);
        const newId = res.data.id;
        set({ letterId: newId, isSaving: false });
        return newId;
      }
    } catch {
      set({ isSaving: false });
      return null;
    }
  },

  loadFromServer: async (letterId: string) => {
    set({ isSaving: true });
    try {
      const res = await lettersApi.getById(letterId);
      if (!res.success) throw new Error(res.error.message);
      const letter = res.data;
      set({
        letterId: letter.id,
        category: letter.category,
        currentStep: letter.currentStep,
        body: letter.body,
        bodyDelta: letter.bodyDelta ?? null,
        paperColor: letter.paperColor ?? 'white',
        extras: letter.extras,
        recipient: letter.recipient,
        sender: letter.sender,
        pricing: letter.pricing,
        paymentStatus: letter.paymentStatus,
        fulfillmentStatus: letter.fulfillmentStatus,
        isSaving: false,
      });
    } catch {
      set({ isSaving: false });
    }
  },

  reset: () =>
    set({
      category: null,
      currentStep: 0,
      letterId: null,
      isSaving: false,
      body: '',
      bodyDelta: null,
      paperColor: 'white',
      extras: [],
      recipient: { ...defaultRecipient },
      sender: { ...defaultSender },
      pricing: { ...defaultPricing },
      paymentStatus: 'draft',
      fulfillmentStatus: 'unpaid',
    }),
}));
