import type { Request, Response } from 'express';
import { letterRepository } from '../repositories/letter.repository.js';
import { generateLetterPdf } from '../services/pdf.service.js';
import { AppError } from '../middlewares/error.middleware.js';

export const pdfController = {
  async download(req: Request, res: Response): Promise<void> {
    const userId = req.user!.uid;
    const letterId = req.params.letterId as string;

    if (!letterId) {
      res.status(400).json({ error: 'Missing letterId' });
      return;
    }

    const letter = await letterRepository.findById(letterId);
    if (!letter) throw new AppError(404, 'LETTER_NOT_FOUND', 'Letter not found');
    if (letter.userId !== userId) throw new AppError(403, 'FORBIDDEN', 'Not your letter');

    try {
      const pdfBuffer = await generateLetterPdf(letter);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="letter-${letterId}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.end(pdfBuffer);
    } catch (error) {
      console.error('PDF generation failed:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  },
};
