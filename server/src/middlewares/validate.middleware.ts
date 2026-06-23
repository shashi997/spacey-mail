import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.parse(req[source]);
    // Replace with parsed (and transformed) data so defaults are applied
    if (source === 'body') req.body = result;
    else if (source === 'query') (req as any).parsedQuery = result;
    else if (source === 'params') (req as any).parsedParams = result;
    next();
  };
};
