import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../middlewares/ResponseHandler';
import { PrismaClient } from '@prisma/client';
import { LoggerUtility } from '../Utilities/LoggerUtility';
import { prismaConnection } from '../utils/database';

/**
 * Global error handler middleware that catches and processes all unhandled errors.
 * Provides centralized error logging and standardized error responses.
 */
export class GlobalErrorHandler {
  private static prisma: PrismaClient = prismaConnection;
  public static logger: LoggerUtility = LoggerUtility.getInstance(GlobalErrorHandler.prisma);

  /**
   * Handles all errors thrown in the application.
   * Logs the error and sends a standardized error response to the client.
   * @param err The error object that was thrown
   * @param req Express request object
   * @param res Express response object
   * @param _next Express next function (unused in error handlers)
   */
  static handleErrors(
    err: Error & { status?: number },
    req: Request,
    res: Response,
    _next: NextFunction,
  ): void {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    GlobalErrorHandler.logger.error(message);
    ResponseHandler.errorResponse(res, message, statusCode);
    return;
  }
}
