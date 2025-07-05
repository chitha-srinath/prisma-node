import { NextFunction, Request, Response } from 'express';
import { auth } from '../../auth';
import { GlobalErrorHandler } from './GlobalErrorHandler';
import { AuthenticatedRequest, UserSession } from '../interface/modified-request';

/**
 * Middleware that validates authentication using better-auth library.
 * Extracts session information from request headers and attaches user data to the request.
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
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) headers.append(key, value.toString());
    });

    const session = await auth.api.getSession({
      headers: headers,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    (req as unknown as AuthenticatedRequest).user = {
      id: session.user.id,
      username: session.user.name,
      email: session.user.email,
      avatarUrl: session.user.image || '',
    };
    (req as unknown as AuthenticatedRequest).session = session.session as UserSession;
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
