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
export function validatePayload<T>(schema: ZodSchema<T>, type: ValidationType = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req[type]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issue = error.issues[0];
        next(
          new PayloadError(
            `${issue?.message || 'Validation failed'} for ${issue?.path?.[0] !== undefined ? String(issue.path[0]) : 'field'}`,
          ),
        );
      } else {
        next(error);
      }
    }
  };
}
