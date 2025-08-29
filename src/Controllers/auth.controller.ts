import { NextFunction, Request, Response } from 'express';
import { BadRequestError, DatabaseError, UnauthorizedError } from '../Utilities/ErrorUtility';
import { ResponseHandler } from '../Utilities/ResponseHandler';
import { PrismaErrorHandler } from '../Utilities/databaseErrors';
import { SuccessMessages } from '../constants/success-messages.constants';
import { LoginPostDto, RegisterPostDto } from '@/Dtos/auth.dto';
import { AuthService } from '../services/Authentication/Auth.service';
import { GoogleOAuthService } from '../services/Authentication/google.auth';
import { UserService } from '../services/user.service';
import { config } from '../config/config';
import { generateJwtToken } from '../Utilities/encrypt-hash';
import { randomUUID } from 'node:crypto';
import { RefreshToken } from '../constants/regular.constants';
import { UserContext } from '../Utilities/user-context';
import { ErrorMessages } from '@/constants/error-messages.constatnts';

// import { randomUUID } from 'crypto';

/**
 * Controller for authentication-related endpoints.
 * Handles login, registration, user fetching, and access token retrieval.
 */
export class AuthController {
  private readonly authService: AuthService;
  private readonly googleService: GoogleOAuthService;
  private readonly userService: UserService;
  /**
   * Initializes the AuthController and its AuthService dependency.
   */
  constructor() {
    this.authService = new AuthService();
    this.googleService = new GoogleOAuthService();
    this.userService = new UserService();
  }

  /**
   * Handles user login.
   * @param req Express request object containing login credentials in body
   * @param res Express response object
   * @param next Express next function for error handling
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.signIn(req.body as unknown as LoginPostDto);

      //Set refresh token in secure cookie
      res.cookie(RefreshToken, result.refreshToken, {
        httpOnly: true,
        secure: false, // must be true in production
        sameSite: 'none',
        // path: '/api/auth/access-token', // or "/api/auth" if you need it for multiple auth endpoints
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      ResponseHandler.successResponse(
        res,
        { token: result.accessToken },
        SuccessMessages.AUTH.LOGIN_SUCCESSFULL,
        200,
      ); // keep response message in enum or db
    } catch (error) {
      if (PrismaErrorHandler.handlePrismaError(error) instanceof DatabaseError) {
        return next(PrismaErrorHandler.handlePrismaError(error));
      }
      next(error);
    }
  }

  /**
   * Handles user registration.
   * @param req Express request object containing registration data in body
   * @param res Express response object
   * @param next Express next function for error handling
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.signUp(req.body as unknown as RegisterPostDto);
      ResponseHandler.successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetches the authenticated user's details from the request.
   * @param req Express request object (should be AuthenticatedRequest)
   * @param res Express response object
   * @param next Express next function for error handling
   */
  async fetchUserResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = UserContext.getUser();
      ResponseHandler.successResponse(res, result, 'user feteched sucessfully', 200);
    } catch (error) {
      if (PrismaErrorHandler.handlePrismaError(error) instanceof DatabaseError) {
        return next(PrismaErrorHandler.handlePrismaError(error));
      }
      next(error);
    }
  }

  /**
   * Retrieves a new access token using the refresh token from cookies.
   * @param req Express request object (expects refreshToken cookie)
   * @param res Express response object
   * @param next Express next function for error handling
   */
  async getAccessToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req?.cookies?.refreshToken as string;

      if (!token) {
        next(new UnauthorizedError('no refresh token provided'));
        return;
      }
      const result = await this.authService.fetchAcessToken(token);

      ResponseHandler.successResponse(res, result);
    } catch (error) {
      if (PrismaErrorHandler.handlePrismaError(error) instanceof DatabaseError) {
        return next(PrismaErrorHandler.handlePrismaError(error));
      }
      next(error);
    }
  }

  /**
   * Logs out the authenticated user by invalidating their session.
   * @param req Express request object (should be AuthenticatedRequest)
   * @param res Express response object
   * @param next Express next function for error handling
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = UserContext.getSession();
      const sessionId = session?.id;

      if (sessionId) {
        await this.authService.logout(sessionId);
      }

      // Clear refresh token cookie
      res.clearCookie(RefreshToken, {
        httpOnly: true,
        secure: false, // must be true in production
        sameSite: 'none',
        // path: '/api/auth/access-token',
        maxAge: 0,
        expires: new Date(Date.now()),
      });

      ResponseHandler.successResponse(res, null, 'Logged out successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  googleOauth(req: Request, res: Response, next: NextFunction): void {
    try {
      const googleRedirectURI = this.googleService.getAuthUrl();
      res.redirect(googleRedirectURI);
    } catch (err) {
      next(err);
    }
  }
  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { code, error } = req.query;

      // Handle OAuth errors
      if (error) {
        return res.redirect(`${config.frontend_url}/login?error=oauth_error`);
      }

      const codeStr =
        typeof code === 'string'
          ? code
          : Array.isArray(code) && typeof code[0] === 'string'
            ? code[0]
            : undefined;

      if (!codeStr) {
        return res.redirect(`${config.frontend_url}/login?error=missing_code`);
      }
      const googleTokens = (await this.googleService.exchangeCodeForTokens(codeStr)) as {
        access_token: string;
      };

      // Get user info from Google
      const googleUserInfo = await this.googleService.getUserInfo(googleTokens.access_token);

      // Find or create user in your database
      const user = await this.userService.findOrCreateGoogleUser(
        googleUserInfo as { email: string; id: string; name: string; picture?: string },
      );

      // Generate your own tokens
      const sessionId = randomUUID();
      const accessToken = generateJwtToken({
        userId: user.id,
        email: user.email,
        sessionId: sessionId,
      });

      const refreshToken = generateJwtToken({
        sessionId: sessionId,
        userId: user.id,
      });

      // Save session in your database
      await this.userService.createSession({ userId: user.id, sessionId });

      //Set refresh token in secure cookie
      res.cookie(RefreshToken, refreshToken, {
        httpOnly: true,
        secure: false, // must be true in production
        sameSite: 'none',
        // path: '/api/auth/access-token', // or "/api/auth" if you need it for multiple auth endpoints
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // // Redirect to frontend with access token
      res.redirect(`${config.frontend_url}/dashboard?token=${accessToken}`);
    } catch (error) {
      console.error(error);
      res.redirect(`${config.frontend_url}/login?error=oauth_failed`);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      await this.authService.sendPasswordResetEmail(email);
      ResponseHandler.successResponse(res, null, 'Password reset email sent', 200);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword(token, newPassword);
      ResponseHandler.successResponse(res, null, 'Password reset successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      await this.authService.verifyPasswordResetToken(token);
      ResponseHandler.successResponse(res, null, 'Token is valid', 200);
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, otp } = req.body;
      await this.authService.verifyEmail(token, otp);
      ResponseHandler.successResponse(res, null, 'Email verified successfully', 200);
    } catch (error) {
      next(error);
    }
  }
  async verifyAccessToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!UserContext.getUser()) {
        return next(new BadRequestError(ErrorMessages.AUTH.INVALID_ACCESS_TOKEN));
      }
      ResponseHandler.successResponse(res, null, 'Access token is valid', 200);
    } catch (error) {
      next(error);
    }
  }
}
