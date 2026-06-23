import { db } from '../config/firebaseadmin.js';
import type { LetterDocument, CreateLetterDto } from '../types/letter.types.js';

const COLLECTION = 'letters';

function toDocument(doc: FirebaseFirestore.DocumentSnapshot): LetterDocument | null {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as LetterDocument;
}

export const letterRepository = {
  async create(data: CreateLetterDto & {
    userId: string;
    pageCount: number;
    pricing: LetterDocument['pricing'];
    paymentStatus: LetterDocument['paymentStatus'];
    fulfillmentStatus: LetterDocument['fulfillmentStatus'];
  }): Promise<string> {
    const docRef = db.collection(COLLECTION).doc();
    await docRef.set({
      ...data,
      currentStep: data.currentStep ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  },

  async findById(letterId: string): Promise<LetterDocument | null> {
    const doc = await db.collection(COLLECTION).doc(letterId).get();
    return toDocument(doc);
  },

  async findByUserId(userId: string, limit = 50): Promise<LetterDocument[]> {
    const snapshot = await db.collection(COLLECTION)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as LetterDocument);
  },

  async update(letterId: string, data: Record<string, unknown>): Promise<void> {
    await db.collection(COLLECTION).doc(letterId).update({
      ...data,
      updatedAt: new Date(),
    });
  },

  async delete(letterId: string): Promise<void> {
    await db.collection(COLLECTION).doc(letterId).delete();
  },
};
