import { Router } from 'express';
import { PostController } from '../Controllers/post.contoller';

export class PostRoutes {
  private router: Router;
  private postController: PostController;

  constructor() {
    this.router = Router();
    this.postController = new PostController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', this.postController.createpost.bind(this.postController));
    this.router.get('/', this.postController.getAllposts.bind(this.postController));
    this.router.get('/:id', this.postController.getpostById.bind(this.postController));
    this.router.put('/:id', this.postController.updatepost.bind(this.postController));
    this.router.delete('/:id', this.postController.deletepost.bind(this.postController));
  }

  public getRouter(): Router {
    return this.router;
  }
}
