import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from './ResponseHandler';

export class GlobalErrorHandler {
  static handleErrors(
    err: Error & { status?: number },
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    ResponseHandler.errorResponse(res, message, statusCode);
    return;
  }
}
