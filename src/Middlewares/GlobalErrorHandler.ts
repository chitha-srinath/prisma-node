import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from './ResponseHandler';
import { PrismaClient } from '@prisma/client';
import { LoggerUtility } from '../Utilities/LoggerUtility';

export class GlobalErrorHandler {
  private static prisma: PrismaClient = new PrismaClient();
  public static logger: LoggerUtility = new LoggerUtility(GlobalErrorHandler.prisma);

  static handleErrors(
    err: Error & { status?: number },
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';
    GlobalErrorHandler.logger.error(message);
    ResponseHandler.errorResponse(res, message, statusCode);
    return;
  }
}
