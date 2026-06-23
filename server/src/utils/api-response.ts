import type { Response } from 'express';
import type { ApiResponse, ErrorResponse } from '../types/api.types.js';

export function sendSuccess<T>(res: Response, data: T, status = 200): void {
  const body: ApiResponse<T> = { success: true, data };
  res.status(status).json(body);
}

export function sendError(res: Response, code: string, message: string, status = 500, details?: unknown): void {
  const body: ErrorResponse = { success: false, error: { code, message, details } };
  res.status(status).json(body);
}
