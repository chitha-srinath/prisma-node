<<<<<<< HEAD
import { Router } from 'express';
import { UserController } from '../controller/user.controller';

export class UserRoutes {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', this.userController.createuser.bind(this.userController));
    this.router.get('/', this.userController.getAllusers.bind(this.userController));
    this.router.get('/:id', this.userController.getuserById.bind(this.userController));
    this.router.put('/:id', this.userController.updateuser.bind(this.userController));
    this.router.delete('/:id', this.userController.deleteuser.bind(this.userController));
  }

  public getRouter(): Router {
    return this.router;
  }
}
=======
import { Router } from 'express';
import { UserController } from '../Controllers/user.controller';

export class UserRoutes {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', this.userController.createuser.bind(this.userController));
    this.router.get('/', this.userController.getAllusers.bind(this.userController));
    this.router.get('/:id', this.userController.getuserById.bind(this.userController));
    this.router.put('/:id', this.userController.updateuser.bind(this.userController));
    this.router.delete('/:id', this.userController.deleteuser.bind(this.userController));
  }

  public getRouter(): Router {
    return this.router;
  }
}
>>>>>>> 0608f1f444a5d2798500523d96595927371ae41e
