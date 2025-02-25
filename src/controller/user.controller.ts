import { Request, Response } from 'express';
import { UserService } from '../services/user.service';


export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createuser(req: Request, res: Response) {
    try {
      const user = await this.userService.createuser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async getAllusers(_req: Request, res: Response) {
    try {
      const users = await this.userService.getAllusers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getuserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.userService.getuserById(Number(id));
      if (!user) {
        res.status(404).json({ message: 'user not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async updateuser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const data = req.body;
      const user = await this.userService.updateuser(Number(id), data);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async deleteuser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.userService.deleteuser(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
