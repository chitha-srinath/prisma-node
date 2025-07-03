import { Todo } from '@prisma/client';

import { TodoRepository } from '../repositories/Todo.repostiory';
import { CreateTodoData, UpdateTodoData } from '@/Dtos/todo.dto';

/**
 * Service for todo-related business logic.
 * Handles creation, retrieval, update, and deletion of todo items.
 */
export class TodoService {
  private todoRepository: TodoRepository;

  /**
   * Initializes the TodoService and its TodoRepository dependency.
   */
  constructor() {
    this.todoRepository = new TodoRepository();
  }

  /**
   * Creates a new todo item.
   * @param data Data for the new todo item
   * @returns The created Todo object
   */
  async createTodo(data: CreateTodoData): Promise<Todo> {
    return this.todoRepository.insert(data);
  }

  /**
   * Retrieves all todo items.
   * @returns Array of Todo objects
   */
  async getAllTodos(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  /**
   * Retrieves a todo item by its ID.
   * @param id Todo item ID
   * @returns The Todo object or null if not found
   */
  async getTodoById(id: number): Promise<Todo | null> {
    return this.todoRepository.findById(id);
  }

  /**
   * Updates a todo item by its ID.
   * @param id Todo item ID
   * @param data Data to update the todo item
   * @returns The updated Todo object
   * @throws Error if todo is not found
   */
  async updateTodo(id: number, data: UpdateTodoData): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return this.todoRepository.update({ id }, data);
  }

  /**
   * Deletes a todo item by its ID.
   * @param id Todo item ID
   * @returns The deleted Todo object
   * @throws Error if todo is not found
   */
  async deleteTodo(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return this.todoRepository.delete(id);
  }
}
