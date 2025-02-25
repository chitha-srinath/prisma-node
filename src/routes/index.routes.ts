import { Router } from 'express';
import { TodoRoutes } from './todo.routes';

export class AppRouter {
  private router: Router;

  constructor() {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use('/todos', new TodoRoutes().getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new AppRouter().getRouter();
