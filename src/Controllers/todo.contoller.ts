import { NextFunction, Request, Response } from 'express';
import { DatabaseError, NotFoundError } from '../Utilities/ErrorUtility';
import { ResponseHandler } from '../middlewares/ResponseHandler';
import { PrismaErrorHandler } from '../Utilities/databaseErrors';
import { TodoService } from '../services/todo.service';
import { SuccessMessages } from '../constants/success-messages.constants';
import { ErrorMessages } from '../constants/error-messages.constatnts';

/**
 * Controller for todo-related endpoints.
 * Handles todo creation, retrieval, update, and deletion operations.
 * Provides HTTP interface for todo management functionality.
 */
export class TodoController {
  private todoService: TodoService;

  /**
   * Initializes the TodoController and its TodoService dependency.
   */
  constructor() {
    this.todoService = new TodoService();
  }

  /**
   * Creates a new todo item with the provided data.
   * @param req Express request object containing todo data in body
   * @param res Express response object
   * @param next Express next function for error handling
   */
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

  /**
   * Retrieves all todo items from the system.
   * @param _req Express request object (unused)
   * @param res Express response object
   * @param next Express next function for error handling
   */
  async getAllTodos(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const todos = await this.todoService.getAllTodos();
      ResponseHandler.successResponse(res, todos);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves a specific todo item by its ID.
   * @param req Express request object containing todo ID in params
   * @param res Express response object
   * @param next Express next function for error handling
   */
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

  /**
   * Updates an existing todo item with new data.
   * @param req Express request object containing todo ID in params and update data in body
   * @param res Express response object
   * @param next Express next function for error handling
   */
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

  /**
   * Deletes a todo item by its ID.
   * @param req Express request object containing todo ID in params
   * @param res Express response object
   * @param next Express next function for error handling
   */
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
