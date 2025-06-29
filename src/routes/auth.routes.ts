import { Router } from 'express';

export class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('login');
    this.router.post('regiister');
    this.router.get('user-detils');
    this.router.get('access-token');
  }

  public getRouter(): Router {
    return this.router;
  }
}
