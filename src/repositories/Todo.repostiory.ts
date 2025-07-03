import { Todo } from '@prisma/client';
import { BaseRepository } from './baserepostiory';
import { PrismaClient } from '@prisma/client';

/**
 * Repository for Todo entity, extends the generic BaseRepository.
 */
// Todo repository implementation
export class TodoRepository extends BaseRepository<Todo, PrismaClient['todo']> {
  /**
   * Initializes the TodoRepository with the Prisma todo model.
   */
  constructor() {
    super((prisma) => prisma.todo);
  }
}
