import { NextFunction, Request, Response } from 'express';
import { DatabaseError, UnauthorizedError } from '../Utilities/ErrorUtility';
import { ResponseHandler } from '../middlewares/ResponseHandler';
import { PrismaErrorHandler } from '../Utilities/databaseErrors';
import { SuccessMessages } from '../constants/success-messages.constants';
import { LoginPostDto, RegisterPostDto } from '@/Dtos/auth.dto';
import { AuthService } from '@/services/Auth.service';
import { AuthenticatedRequest } from '@/interface/modified-request';

export class AuthController {
  private readonly authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

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

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.signUp(req.body as unknown as RegisterPostDto);
      ResponseHandler.successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async fetchUserResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authenticatedReq = req as unknown as AuthenticatedRequest;
      console.log(authenticatedReq.user);
      const result = authenticatedReq.user;
      if (!result) {
        next(new UnauthorizedError('user not found'));
      }
      ResponseHandler.successResponse(res, result, 'user feteched sucessfully', 200);
    } catch (error) {
      next(error);
    }
  }

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
