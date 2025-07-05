import { Router } from 'express';
import { PostController } from '../Controllers/post.contoller';
import { validatePayload } from '../middlewares/Payload-verify';
import { createPostDto } from '../Dtos/post.dto';
import { PayLoadType } from '../Enums/payload.enum';

/**
 * Router for post-related endpoints.
 * Handles post CRUD operations with payload validation.
 */
export class PostRoutes {
  private router: Router;
  private postController: PostController;

  /**
   * Initializes the post router and sets up post management routes.
   */
  constructor() {
    this.router = Router();
    this.postController = new PostController();
    this.initializeRoutes();
  }

  /**
   * Sets up all post-related routes with appropriate middleware.
   * Includes payload validation for post creation and standard CRUD operations.
   */
  private initializeRoutes(): void {
    this.router.post(
      '/',
      validatePayload(createPostDto, PayLoadType.BODY),
      this.postController.createpost.bind(this.postController),
    );
    this.router.get('/', this.postController.getAllposts.bind(this.postController));
    this.router.get('/:id', this.postController.getpostById.bind(this.postController));
    this.router.put('/:id', this.postController.updatepost.bind(this.postController));
    this.router.delete('/:id', this.postController.deletepost.bind(this.postController));
  }

  /**
   * Returns the configured Express router instance.
   * @returns Express Router instance with post routes configured
   */
  public getRouter(): Router {
    return this.router;
  }
}
