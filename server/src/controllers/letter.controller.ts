import type { Request, Response } from 'express';
import { letterService } from '../services/letter.service.js';
import { sendSuccess } from '../utils/api-response.js';

export const letterController = {
  async create(req: Request, res: Response): Promise<void> {
    const userId = req.user!.uid;
    const letter = await letterService.create(userId, req.body);
    sendSuccess(res, letter, 201);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const userId = req.user!.uid;
    const letterId = req.params.letterId as string;
    const letter = await letterService.getById(letterId, userId);
    sendSuccess(res, letter);
  },

  async list(req: Request, res: Response): Promise<void> {
    const userId = req.user!.uid;
    const letters = await letterService.listByUser(userId);
    sendSuccess(res, letters);
  },

  async update(req: Request, res: Response): Promise<void> {
    const userId = req.user!.uid;
    const letterId = req.params.letterId as string;
    const letter = await letterService.update(letterId, userId, req.body);
    sendSuccess(res, letter);
  },
};
