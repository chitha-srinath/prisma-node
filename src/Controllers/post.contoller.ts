import { NextFunction, Request, Response } from 'express';
import { DatabaseError, NotFoundError } from '../Utilities/ErrorUtility';
import { ResponseHandler } from '../middlewares/ResponseHandler';
import { PrismaErrorHandler } from '../Utilities/databaseErrors';
import { PostService } from '../services/post.service';
import { SuccessMessages } from '../constants/success-messages.constants';
import { ErrorMessages } from '../constants/error-messages.constatnts';
import { CreatePostData } from '../Dtos/post.dto';
import { AuthenticatedRequest } from '@/interface/modified-request';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  async createpost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authenticatedReq = req as unknown as AuthenticatedRequest;
      console.log(authenticatedReq.user);
      const post = await this.postService.createpost(req.body as unknown as CreatePostData);
      ResponseHandler.successResponse(res, post, SuccessMessages.POST.CREATED, 201); // keep response message in enum or db
    } catch (error) {
      if (PrismaErrorHandler.handlePrismaError(error) instanceof DatabaseError) {
        return next(PrismaErrorHandler.handlePrismaError(error));
      }
      next(error);
    }
  }

  async getAllposts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authenticatedReq = req as unknown as AuthenticatedRequest;
      console.log('get posts', authenticatedReq.user);
      const posts = await this.postService.getAllposts();
      ResponseHandler.successResponse(res, posts);
    } catch (error) {
      next(error);
    }
  }

  async getpostById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const post = await this.postService.getpostById(Number(id));
      if (!post) {
        //throw new Error();
        // throw new Error('Not Found');
        next(new NotFoundError(ErrorMessages.POST.POST_NOT_FOUND));
        return;
      }
      ResponseHandler.successResponse(res, post);
    } catch (error) {
      next(error);
    }
  }

  async updatepost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const data = req.body;
      const post = await this.postService.updatepost(Number(id), data);
      ResponseHandler.successResponse(res, post);
    } catch (error) {
      if (PrismaErrorHandler.handlePrismaError(error) instanceof DatabaseError) {
        return next(PrismaErrorHandler.handlePrismaError(error));
      }
      next(error);
    }
  }

  async deletepost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      await this.postService.deletepost(Number(id));
      //ResponseHandler.sucessResponse(res, undefined, undefined, 204);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}
