import type { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebaseadmin.js';
import { sendError } from '../utils/api-response.js';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    sendError(res, 'MISSING_AUTH_TOKEN', 'Authorization header with Bearer token required', 401);
    return;
  }

  const token = header.split('Bearer ')[1];
  if (!token) {
    sendError(res, 'MISSING_AUTH_TOKEN', 'Token not provided in Authorization header', 401);
    return;
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    sendError(res, 'INVALID_TOKEN', 'Invalid or expired authentication token', 401);
  }
};
