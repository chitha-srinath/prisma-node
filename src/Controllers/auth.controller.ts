import { NextFunction, Request, Response } from 'express';
import { DatabaseError, UnauthorizedError } from '../Utilities/ErrorUtility';
import { ResponseHandler } from '../middlewares/ResponseHandler';
import { PrismaErrorHandler } from '../Utilities/databaseErrors';
import { SuccessMessages } from '../constants/success-messages.constants';
import { LoginPostDto, RegisterPostDto } from '@/Dtos/auth.dto';
import { AuthService } from '../services/Authentication/Auth.service';
import { AuthenticatedRequest } from '@/interface/modified-request';
import { GoogleOAuthService } from '../services/Authentication/google.auth';
import { UserService } from '../services/user.service';
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
      ResponseHandler.successResponse(res, result, SuccessMessages.AUTH.LOGIN_SUCCESSFULL, 200); // keep response message in enum or db
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
      const authenticatedReq = req as unknown as AuthenticatedRequest;
      const result = authenticatedReq.user;
      if (!result) {
        next(new UnauthorizedError('user not found'));
      }
      ResponseHandler.successResponse(res, result, 'user feteched sucessfully', 200);
    } catch (error) {
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
        next(new UnauthorizedError('token not found'));
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
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_error`);
      }

      const codeStr =
        typeof code === 'string'
          ? code
          : Array.isArray(code) && typeof code[0] === 'string'
          ? code[0]
          : undefined;
      if (!codeStr) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=missing_code`);
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

      // // Generate your own tokens
      // const sessionId = randomUUID();
      // const accessToken = TokenService.generateAccessToken({
      //   userId: user._id,
      //   email: user.email,
      //   sessionId: sessionId,
      // });

      // const refreshToken = TokenService.generateRefreshToken({
      //   sessionId: sessionId,
      //   userId: user._id,
      // });

      // // Save session in your database
      // await SessionService.createSession(user._id, refreshToken, accessToken);

      // Set refresh token in secure cookie
      // res.cookie('refreshToken', refreshToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === 'production',
      //   sameSite: 'strict',
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days0
      // });

      // // Redirect to frontend with access token
      // res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${accessToken}`);
      ResponseHandler.successResponse(res, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
}
