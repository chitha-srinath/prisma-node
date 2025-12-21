import { Todo, PrismaClient, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';

/**
 * Repository for Todo entity operations.
 * Extends BaseRepository to provide type-safe database operations for Todo model.
 * Handles all CRUD operations and advanced queries for todo data.
 */
export class TodoRepository extends BaseRepository<
  Todo,
  Prisma.TodoCreateInput,
  Prisma.TodoUpdateInput,
  Prisma.TodoWhereInput,
  Prisma.TodoWhereUniqueInput,
  PrismaClient['todo']
> {
  /**
   * Initializes the TodoRepository with Prisma todo model.
   * Sets up the repository to work with the Todo entity in the database.
   */
  constructor() {
    super((prisma: PrismaClient) => prisma.todo);
  }
}
