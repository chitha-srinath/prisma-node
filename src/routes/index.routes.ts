import { Router } from 'express';
import { TodoRoutes } from './todo.routes';
import { PostRoutes } from './post.routes';
import { UserRoutes } from './user.routes';
import { AuthRoutes } from './auth.routes';

export class AppRouter {
  private router: Router;

  constructor() {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use('/todos', new TodoRoutes().getRouter());
    this.router.use('/posts', new PostRoutes().getRouter());
    this.router.use('/users', new UserRoutes().getRouter());
    this.router.use('/auth', new AuthRoutes().getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new AppRouter().getRouter();
