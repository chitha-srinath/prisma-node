import { AuthController } from '../Controllers/auth.controller';
import { Router } from 'express';

export class AuthRoutes {
  private router: Router;
  private readonly authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('login', this.authController.login.bind(this.authController));
    this.router.post('regiister', this.authController.register.bind(this.authController));
    this.router.get('user-details', this.authController.fetchUserResult.bind(this.authController));
    this.router.get('access-token', this.authController.getAccessToken.bind(this.authController));
  }

  public getRouter(): Router {
    return this.router;
  }
}
