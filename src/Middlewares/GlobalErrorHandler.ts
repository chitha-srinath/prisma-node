import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../middlewares/ResponseHandler';
import { PrismaClient } from '@prisma/client';
import { LoggerUtility } from '../Utilities/LoggerUtility';
import { prismaConnection } from '../utils/database';

export class GlobalErrorHandler {
  private static prisma: PrismaClient = prismaConnection;
  public static logger: LoggerUtility = LoggerUtility.getInstance(GlobalErrorHandler.prisma);

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
