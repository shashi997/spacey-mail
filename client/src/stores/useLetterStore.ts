import { create } from 'zustand';

export type Category = 'prison' | 'soldier' | 'beloved' | 'regular';

const VALID_CATEGORIES: readonly Category[] = ['prison', 'soldier', 'beloved', 'regular'];

export function isValidCategory(value: string): value is Category {
  return VALID_CATEGORIES.includes(value as Category);
}

interface LetterState {
  category: Category | null;
  currentStep: number;

  // Step 1
  subject: string;
  body: string;  // Stores Quill HTML output

  // Step 2
  extras: string[];

  // Step 3
  recipientName: string;
  recipientAddress: string;
  senderName: string;
  senderEmail: string;

  setCategory: (cat: Category) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateStep1: (data: { subject?: string; body?: string }) => void;
  updateStep2: (data: { extras?: string[] }) => void;
  updateStep3: (data: {
    recipientName?: string;
    recipientAddress?: string;
    senderName?: string;
    senderEmail?: string;
  }) => void;
  reset: () => void;
}

export const useLetterStore = create<LetterState>((set) => ({
  category: null,
  currentStep: 0,

  subject: '',
  body: '',

  extras: [],

  recipientName: '',
  recipientAddress: '',
  senderName: '',
  senderEmail: '',

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

  updateStep1: (data) =>
    set((state) => ({
      subject: data.subject ?? state.subject,
      body: data.body ?? state.body,
    })),

  updateStep2: (data) =>
    set((state) => ({
      extras: data.extras ?? state.extras,
    })),

  updateStep3: (data) =>
    set((state) => ({
      recipientName: data.recipientName ?? state.recipientName,
      recipientAddress: data.recipientAddress ?? state.recipientAddress,
      senderName: data.senderName ?? state.senderName,
      senderEmail: data.senderEmail ?? state.senderEmail,
    })),

  reset: () =>
    set({
      category: null,
      currentStep: 0,
      subject: '',
      body: '',
      extras: [],
      recipientName: '',
      recipientAddress: '',
      senderName: '',
      senderEmail: '',
    }),
}));
