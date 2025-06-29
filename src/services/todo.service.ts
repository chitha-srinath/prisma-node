import { Todo } from '@prisma/client';

import { TodoRepository } from '../repositories/Todo.repostiory';
import { CreateTodoData, UpdateTodoData } from '@/Dtos/todo.dto';

export class TodoService {
  private todoRepository: TodoRepository;

  constructor() {
    this.todoRepository = new TodoRepository();
  }

  async createTodo(data: CreateTodoData): Promise<Todo> {
    return this.todoRepository.insert(data);
  }

  async getAllTodos(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  async getTodoById(id: number): Promise<Todo | null> {
    return this.todoRepository.findById(id);
  }

  async updateTodo(id: number, data: UpdateTodoData): Promise<Todo> {
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
