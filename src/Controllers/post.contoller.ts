import { NextFunction, Request, Response } from 'express';
import { PostService } from '../Services/post.service';
import { ZodError } from 'zod';
import { createPostDto } from '../Dtos/post.dto';
import { DatabaseError, NotFoundError, PayloadError } from '../Utilities/ErrorUtility';
import { ResponseHandler } from '../Middlewares/ResponseHandler';
import { ErrorMsgEnum } from '../Enums/Error.enums';
import { Prisma } from '@prisma/client';
import { PrismaErrorHandler } from '../Utilities/databaseErrors';

export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  async createpost(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = createPostDto.parse(req.body);
      const post = await this.postService.createpost(parsedData);

      ResponseHandler.sucessResponse(res, post, 'User Created successfully', 201); // keep response message in enum or db
      // res.sendStatus(201);
    } catch (error) {
      if (PrismaErrorHandler.handlePrismaError(error) instanceof DatabaseError) {
        return next(PrismaErrorHandler.handlePrismaError(error));
      }
      if (error instanceof ZodError) {
        next(new PayloadError(error?.errors?.[0]?.message));
      }
      next(error);
    }
  }

  async getAllposts(_req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await this.postService.getAllposts();
      ResponseHandler.sucessResponse(res, posts);
    } catch (error) {
      next(error);
    }
  }

  async getpostById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const post = await this.postService.getpostById(Number(id));
      if (!post) {
        //throw new Error();
        // throw new Error('Not Found');
        next(new NotFoundError(ErrorMsgEnum.POST_NOT_FOUND));
        return;
      }
      ResponseHandler.sucessResponse(res, post);
    } catch (error) {
      next(error);
    }
  }

  async updatepost(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const data = req.body;
      const post = await this.postService.updatepost(Number(id), data);
      ResponseHandler.sucessResponse(res, post);
    } catch (error) {
      if (PrismaErrorHandler.handlePrismaError(error) instanceof DatabaseError) {
        return next(PrismaErrorHandler.handlePrismaError(error));
      }
      next(error);
    }
  }

  async deletepost(req: Request, res: Response, next: NextFunction) {
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
