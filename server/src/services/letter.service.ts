import { letterRepository } from '../repositories/letter.repository.js';
import { AppError } from '../middlewares/error.middleware.js';
import type { CreateLetterDto, LetterDocument } from '../types/letter.types.js';

const EXTRA_PRICES: Record<string, number> = {
  photo: 150,
  sticker: 75,
  drawing: 100,
  gift: 250,
};

function calculatePricing(data: { body: string; extras: string[]; recipient: { type: string } }): LetterDocument['pricing'] {
  let basePriceInCents = 299;
  const pages = Math.ceil(data.body.length / 2500);
  if (pages > 1) basePriceInCents += (pages - 1) * 99;

  const extrasPriceInCents = (data.extras ?? []).reduce(
    (sum, e) => sum + (EXTRA_PRICES[e] ?? 0), 0,
  );

  const facilityFeeInCents = data.recipient.type === 'correctional' ? 50
    : data.recipient.type === 'apo_fpo' ? 100 : 0;

  return {
    basePriceInCents,
    extrasPriceInCents,
    facilityFeeInCents,
    totalPriceInCents: basePriceInCents + extrasPriceInCents + facilityFeeInCents,
  };
}

export const letterService = {
  async create(userId: string, data: CreateLetterDto): Promise<LetterDocument> {
    const pricing = calculatePricing(data);
    const pageCount = Math.ceil(data.body.length / 2500);

    const letterId = await letterRepository.create({
      ...data,
      userId,
      pageCount,
      pricing,
      paymentStatus: 'draft',
      fulfillmentStatus: 'unpaid',
    });

    const letter = await letterRepository.findById(letterId);
    if (!letter) throw new AppError(500, 'LETTER_CREATE_FAILED', 'Failed to create letter');
    return letter;
  },

  async getById(letterId: string, userId: string): Promise<LetterDocument> {
    const letter = await letterRepository.findById(letterId);
    if (!letter) throw new AppError(404, 'LETTER_NOT_FOUND', 'Letter not found');
    if (letter.userId !== userId) throw new AppError(403, 'FORBIDDEN', 'Not your letter');
    return letter;
  },

  async listByUser(userId: string): Promise<LetterDocument[]> {
    return letterRepository.findByUserId(userId);
  },

  async update(letterId: string, userId: string, data: Record<string, unknown>): Promise<LetterDocument> {
    const letter = await letterRepository.findById(letterId);
    if (!letter) throw new AppError(404, 'LETTER_NOT_FOUND', 'Letter not found');
    if (letter.userId !== userId) throw new AppError(403, 'FORBIDDEN', 'Not your letter');

    const updateData: Record<string, unknown> = { ...data };

    if (data.body || data.extras || data.recipient) {
      const merged = { ...letter, ...data };
      updateData.pricing = calculatePricing(merged as any);
    }

    if (data.body) {
      updateData.pageCount = Math.ceil(String(data.body).length / 2500);
    }

    await letterRepository.update(letterId, updateData);

    const updated = await letterRepository.findById(letterId);
    if (!updated) throw new AppError(500, 'LETTER_UPDATE_FAILED', 'Failed to update letter');
    return updated;
  },
};
