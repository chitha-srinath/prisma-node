import express, { Express, NextFunction, Response } from 'express';
import cors from 'cors';
import { GlobalErrorHandler } from './src/middlewares/GlobalErrorHandler';
import { BadRequestError } from './src/Utilities/ErrorUtility';
import { ErrorMsgEnum } from './src/Enums/Error.enums';
import helmet from 'helmet';
import indexRoutes from './src/routes/index.routes';
import limiter from './src/utils/rate-limit';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './src/utils/auth_config';
export class App {
  public readonly app: Express;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(
      cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      }),
    );
    this.app.all('/api/auth/*splat', toNodeHandler(auth));
    this.app.use(express.json());
    this.app.disable('x-powered-by');
    this.app.use(helmet());
    this.app.use(limiter);
  }

  private initializeRoutes(): void {
    this.app.get('/health', (_, res: Response) => {
      res.status(200).json({ status: 'healthy' });
    });
    this.app.use('/api', indexRoutes);
  }

  private initializeErrorHandling(): void {
    this.app.use('*', (_, res: Response, next: NextFunction) => {
      next(new BadRequestError(ErrorMsgEnum.BAD_REQUEST));
    });
    this.app.use(GlobalErrorHandler.handleErrors);
  }
}
