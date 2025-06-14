import { NextFunction, Request, Response } from 'express';
import { auth } from '../utils/auth_config';
import { GlobalErrorHandler } from './GlobalErrorHandler';

declare global {
  namespace Express {
    interface Request {
      user: any;
      session: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) headers.append(key, value.toString());
    });

    const session = await auth.api.getSession({
      headers,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    req['user'] = session.user;
    req['session'] = session.session;
    next();
  } catch (error) {
    GlobalErrorHandler.logger.error(`Auth middleware error: ${error}`);
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication',
    });
  }
};
