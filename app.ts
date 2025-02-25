import express, { Express } from 'express';
import cors from 'cors';
import indexRoutes from './src/routes/index.routes';

export class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.use('/api', indexRoutes);
  }
  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
}
