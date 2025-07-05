import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { PayloadError } from '../Utilities/ErrorUtility';

/**
 * Type definition for request validation targets.
 * Specifies which part of the request to validate.
 */
type ValidationType = 'body' | 'query' | 'params';

/**
 * Middleware factory that creates a validation middleware using Zod schema.
 * Validates request data against a provided schema and handles validation errors.
 * @param schema Zod schema for validation
 * @param type The part of the request to validate (body, query, or params)
 * @returns Express middleware function that validates the request
 */
export function validatePayload<T>(
  schema: ZodSchema<T>,
  type: ValidationType = 'body',
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[type]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0];
        const errorMessage = firstError?.message || 'Validation failed';
        const fieldName = firstError?.path?.[0] || 'unknown field';
        next(new PayloadError(`${errorMessage} for ${fieldName}`));
      } else {
        next(error);
      }
    }
  };
}
