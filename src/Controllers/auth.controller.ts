import { NextFunction, Request, Response } from 'express';
import { DatabaseError, UnauthorizedError } from '../Utilities/ErrorUtility';
import { ResponseHandler } from '../middlewares/ResponseHandler';
import { PrismaErrorHandler } from '../Utilities/databaseErrors';
import { SuccessMessages } from '../constants/success-messages.constants';
import { LoginPostDto, RegisterPostDto } from '@/Dtos/auth.dto';
import { AuthService } from '../services/Auth.service';
import { AuthenticatedRequest } from '@/interface/modified-request';

/**
 * Controller for authentication-related endpoints.
 * Handles login, registration, user fetching, and access token retrieval.
 */
export class AuthController {
  private readonly authService: AuthService;
  /**
   * Initializes the AuthController and its AuthService dependency.
   */
  constructor() {
    this.authService = new AuthService();
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
}
