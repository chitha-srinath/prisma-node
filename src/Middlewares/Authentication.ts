import { NextFunction, Request, Response } from 'express';

import { GlobalErrorHandler } from './GlobalErrorHandler';
import { AuthenticatedRequest } from '../interface/modified-request';
import { UnauthorizedError } from '@/Utilities/ErrorUtility';
import { verifyJwtToken } from '@/Utilities/encrypt-hash';
import { ErrorMessages } from '@/constants/error-messages.constatnts';

/**
 * Middleware that validates JWT authentication tokens.
 * Extracts the token from the Authorization header, verifies it, and attaches user data to the request.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns Promise that resolves to void or Response
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new UnauthorizedError(ErrorMessages.AUTH.TOKEN_REQUIRED));
    }

    let payload;
    try {
      payload = await verifyJwtToken(token);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'name' in err) {
        const errorName = (err as { name: string }).name;
        if (errorName === 'TokenExpiredError') {
          return next(new UnauthorizedError(ErrorMessages.AUTH.TOKEN_EXPIRED));
        } else if (errorName === 'JsonWebTokenError') {
          return next(new UnauthorizedError(ErrorMessages.AUTH.TOKEN_INVALID));
        }
      }
      return next(new UnauthorizedError('Invalid authentication'));
    }

    // Attach user/session to request if present in payload
    (req as unknown as AuthenticatedRequest).user = payload.user;
    (req as unknown as AuthenticatedRequest).session = payload.session;

    next();
  } catch (error) {
    GlobalErrorHandler.logger.error(
      `Auth middleware error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication',
    });
  }
};
