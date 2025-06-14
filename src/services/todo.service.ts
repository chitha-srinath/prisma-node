<<<<<<< HEAD
import { Todo } from '@prisma/client';
import { CreateTodoData, UpdateTodoData } from '../interface/todo';
// import { BaseRepository } from '../repositories/baserepostiory';
import { TodoRepository } from '../repositories/Todo.repostiory';

export class TodoService {
  private todoRepository: TodoRepository;

  constructor() {
    this.todoRepository = new TodoRepository();
  }

  async createTodo(data: CreateTodoData): Promise<Todo> {
    return this.todoRepository.create(data);
  }

  async getAllTodos(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  async getTodoById(id: number): Promise<Todo | null> {
    return this.todoRepository.findById(id);
  }

  async updateTodo(id: number, data: UpdateTodoData) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return this.todoRepository.update(id, data);
  }

  async deleteTodo(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return this.todoRepository.delete(id);
  }
}
=======
import { Todo } from '@prisma/client';
import { CreateTodoData, UpdateTodoData } from '../Dtos/todo.dto';
// import { BaseRepository } from '../repositories/baserepostiory';
import { TodoRepository } from '../Repositories/Todo.repostiory';

export class TodoService {
  private todoRepository: TodoRepository;

  constructor() {
    this.todoRepository = new TodoRepository();
  }

  async createTodo(data: CreateTodoData): Promise<Todo> {
    return this.todoRepository.create(data);
  }

  async getAllTodos(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  async getTodoById(id: number): Promise<Todo | null> {
    return this.todoRepository.findById(id);
  }

  async updateTodo(id: number, data: UpdateTodoData) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return this.todoRepository.update(id, data);
  }

  async deleteTodo(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return this.todoRepository.delete(id);
  }
}
>>>>>>> 0608f1f444a5d2798500523d96595927371ae41e
