import express, { Express, NextFunction, Response } from 'express';
import cors from 'cors';

import { GlobalErrorHandler } from './src/middlewares/GlobalErrorHandler';
import { BadRequestError } from './src/Utilities/ErrorUtility';
import { ErrorMsgEnum } from './src/Enums/Error.enums';
import helmet from 'helmet';
import indexRoutes from './src/routes/index.routes';

export class App {
  private app: Express;

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
    this.app.use(express.json());
    this.app.disable('x-powered-by');
    this.app.use(helmet());
  }

  private initializeRoutes(): void {
    this.app.get('/', (_, res: Response) => {
      res.send('Hello World!');
    });
    this.app.use('/api', indexRoutes);
  }

  private initializeErrorHandling(): void {
    this.app.use('*', (_, res: Response, next: NextFunction) => {
      next(new BadRequestError(ErrorMsgEnum.BAD_REQUEST));
    });
    this.app.use(GlobalErrorHandler.handleErrors);
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
