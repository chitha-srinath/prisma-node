import { Request, Response } from 'express';
import { TodoService } from '../services/todo.service';

export class TodoController {
  private todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }

  async createTodo(req: Request, res: Response) {
    try {
      const todo = await this.todoService.createTodo(req.body);
      res.status(201).json(todo);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async getAllTodos(_req: Request, res: Response) {
    try {
      const todos = await this.todoService.getAllTodos();
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getTodoById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const todo = await this.todoService.getTodoById(Number(id));
      if (!todo) {
        res.status(404).json({ message: 'Todo not found' });
        return;
      }
      res.status(200).json(todo);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async updateTodo(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const data = req.body;
      const todo = await this.todoService.updateTodo(Number(id), data);
      res.status(200).json(todo);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async deleteTodo(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await this.todoService.deleteTodo(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
