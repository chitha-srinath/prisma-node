import { Todo } from '@prisma/client';
import { TodoRepository } from '../repositories/Todo.repostiory';
import { CreateTodoData, UpdateTodoData } from '@/Dtos/todo.dto';
import { NotFoundError } from '../Utilities/ErrorUtility';

/**
 * Service for todo-related business logic.
 * Handles creation, retrieval, update, and deletion of todo items.
 * Provides a clean interface between controllers and repositories.
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
   * Creates a new todo item with the provided data.
   * @param data Data for the new todo item including title, description, and completion status
   * @returns Promise resolving to the created Todo object
   */
  async createTodo(data: CreateTodoData): Promise<Todo> {
    return this.todoRepository.insert(data);
  }

  /**
   * Retrieves all todo items from the database.
   * @returns Promise resolving to an array of Todo objects
   */
  async getAllTodos(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  /**
   * Retrieves a specific todo item by its ID.
   * @param id The unique identifier of the todo item
   * @returns Promise resolving to the Todo object or null if not found
   */
  async getTodoById(id: number): Promise<Todo | null> {
    return this.todoRepository.findById(id);
  }

  /**
   * Updates an existing todo item with new data.
   * @param id The unique identifier of the todo item to update
   * @param data The new data to update the todo item with
   * @returns Promise resolving to the updated Todo object
   * @throws NotFoundError if the todo item with the given ID is not found
   */
  async updateTodo(id: number, data: UpdateTodoData): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundError('Todo not found');
    }
    return this.todoRepository.update({ id }, data);
  }

  /**
   * Deletes a todo item by its ID.
   * @param id The unique identifier of the todo item to delete
   * @returns Promise resolving to the deleted Todo object
   * @throws NotFoundError if the todo item with the given ID is not found
   */
  async deleteTodo(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundError('Todo not found');
    }
    return this.todoRepository.delete(id);
  }
}
