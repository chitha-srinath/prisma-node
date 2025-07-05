import { AuthController } from '../Controllers/auth.controller';
import { Router } from 'express';

/**
 * Router for authentication-related endpoints.
 * Handles user login, registration, user details, and token management.
 */
export class AuthRoutes {
  private router: Router;
  private readonly authController: AuthController;

  /**
   * Initializes the auth router and sets up authentication routes.
   */
  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  /**
   * Sets up all authentication-related routes.
   * Configures endpoints for login, registration, user details, and token refresh.
   */
  private initializeRoutes(): void {
    this.router.post('/login', this.authController.login.bind(this.authController));
    this.router.post('/register', this.authController.register.bind(this.authController));
    this.router.get('/user-details', this.authController.fetchUserResult.bind(this.authController));
    this.router.get('/access-token', this.authController.getAccessToken.bind(this.authController));
  }

  /**
   * Returns the configured Express router instance.
   * @returns Express Router instance with auth routes configured
   */
  public getRouter(): Router {
    return this.router;
  }
}
