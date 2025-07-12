import express, { Express, NextFunction, Response } from 'express';
import cors from 'cors';
import { GlobalErrorHandler } from './src/middlewares/GlobalErrorHandler';
import { BadRequestError } from './src/Utilities/ErrorUtility';
import { ErrorMsgEnum } from './src/Enums/Error.enums';
import helmet from 'helmet';
import indexRoutes from './src/routes/index.routes';
import limiter from './src/utils/rate-limit';
// import { toNodeHandler } from 'better-auth/node';
// import { auth } from './auth';
import { config } from './src/config/config';
import { PrismaErrorHandler } from './src/Utilities/databaseErrors';
import cookieParser from 'cookie-parser';

/**
 * Main application class that configures and initializes the Express server.
 * Handles middleware setup, route configuration, and error handling.
 */
export class App {
  public readonly app: Express;

  /**
   * Initializes the Express application with all necessary configurations.
   * Sets up middleware, routes, and error handling in the correct order.
   */
  constructor() {
    this.app = express();
    this.initializeLogger();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initializes the logger for Prisma error handling.
   * Sets up the logger instance that will be used throughout the application.
   */
  private initializeLogger(): void {
    const logger = GlobalErrorHandler.logger;
    PrismaErrorHandler.setLogger(logger);
  }

  /**
   * Configures all middleware for the Express application.
   * Sets up CORS, security headers, rate limiting, and other essential middleware.
   */
  private initializeMiddlewares(): void {
    this.app.use(
      cors({
        origin: config.frontend_url,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      }),
    );
    this.app.disable('x-powered-by');
    this.app.use(helmet());
    this.app.use(limiter);
    this.app.use(cookieParser('wgyfwugfuwhfhkw'));
  }

  /**
   * Sets up all application routes including authentication, health check, and API routes.
   * Configures the routing structure for the entire application.
   */
  private initializeRoutes(): void {
    // this.app.all('/api/auth/*', toNodeHandler(auth));
    this.app.use(express.json());
    this.app.get('/health', (_, res: Response) => {
      res.status(200).json({ status: 'healthy' });
    });
    this.app.use('/api', indexRoutes);
  }

  /**
   * Configures global error handling middleware.
   * Sets up catch-all route for 404 errors and global error handler.
   */
  private initializeErrorHandling(): void {
    this.app.use('*', (_, res: Response, next: NextFunction) => {
      next(new BadRequestError(ErrorMsgEnum.BAD_REQUEST));
    });
    this.app.use(GlobalErrorHandler.handleErrors);
  }
}
