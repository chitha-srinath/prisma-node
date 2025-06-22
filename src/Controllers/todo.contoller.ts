import { NextFunction, Request, Response } from 'express';
import { DatabaseError, NotFoundError } from '../Utilities/ErrorUtility';
import { ResponseHandler } from '../middlewares/ResponseHandler';
import { PrismaErrorHandler } from '../Utilities/databaseErrors';
import { TodoService } from '../services/todo.service';
import { SuccessMessages } from '../constants/success-messages.constants';
import { ErrorMessages } from '../constants/error-messages.constatnts';

export class TodoController {
  private todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }

  async createTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const todo = await this.todoService.createTodo(req.body);
      ResponseHandler.successResponse(res, todo, SuccessMessages.TODO.CREATED, 201);
    } catch (error) {
      if (PrismaErrorHandler.handlePrismaError(error) instanceof DatabaseError) {
        return next(PrismaErrorHandler.handlePrismaError(error));
      }
      next(error);
    }
  }

  async getAllTodos(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const todos = await this.todoService.getAllTodos();
      ResponseHandler.successResponse(res, todos);
    } catch (error) {
      next(error);
    }
  }

  async getTodoById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const todo = await this.todoService.getTodoById(Number(id));
      if (!todo) {
        next(new NotFoundError(ErrorMessages.TODO.TODO_NOT_FOUND));
        return;
      }
      ResponseHandler.successResponse(res, todo);
    } catch (error) {
      next(error);
    }
  }

  async updateTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const data = req.body;
      const todo = await this.todoService.updateTodo(Number(id), data);
      ResponseHandler.successResponse(res, todo);
    } catch (error) {
      if (PrismaErrorHandler.handlePrismaError(error) instanceof DatabaseError) {
        return next(PrismaErrorHandler.handlePrismaError(error));
      }
      next(error);
    }
  }

  async deleteTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      await this.todoService.deleteTodo(Number(id));
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}
