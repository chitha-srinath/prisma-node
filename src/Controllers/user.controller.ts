import { NextFunction, Request, Response } from 'express';
import { DatabaseError, NotFoundError } from '../Utilities/ErrorUtility';
import { ResponseHandler } from '../middlewares/ResponseHandler';
import { PrismaErrorHandler } from '../Utilities/databaseErrors';
import { UserService } from '../services/user.service';
import { SuccessMessages } from '../constants/success-messages.constants';
import { ErrorMessages } from '../constants/error-messages.constatnts';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createuser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.createuser(req.body);
      ResponseHandler.successResponse(res, user, SuccessMessages.USER.CREATED, 201);
    } catch (error) {
      if (PrismaErrorHandler.handlePrismaError(error) instanceof DatabaseError) {
        return next(PrismaErrorHandler.handlePrismaError(error));
      }
      next(error);
    }
  }

  async getAllusers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userService.getAllusers();
      ResponseHandler.successResponse(res, users);
    } catch (error) {
      next(error);
    }
  }

  async getuserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getuserById(Number(id));
      if (!user) {
        next(new NotFoundError(ErrorMessages.USER.USER_NOT_FOUND));
        return;
      }
      ResponseHandler.successResponse(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateuser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const data = req.body;
      const user = await this.userService.updateuser(Number(id), data);
      ResponseHandler.successResponse(res, user);
    } catch (error) {
      if (PrismaErrorHandler.handlePrismaError(error) instanceof DatabaseError) {
        return next(PrismaErrorHandler.handlePrismaError(error));
      }
      next(error);
    }
  }

  async deleteuser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      await this.userService.deleteuser(Number(id));
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}
