import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { PayloadError } from '../Utilities/ErrorUtility';

type ValidationType = 'body' | 'query' | 'params';

/**
 * Middleware factory that creates a validation middleware using Zod schema
 * @param schema - Zod schema for validation
 * @returns Express middleware function
 */
export function validatePayload<T>(schema: ZodSchema<T>, type: ValidationType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[type]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new PayloadError(`${error?.errors?.[0]?.message} for ${error.errors[0].path[0]}`));
      }
      next(error);
    }
  };
}
