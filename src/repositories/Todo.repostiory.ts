import { Todo } from '@prisma/client';
import { BaseRepository } from './baserepostiory';
import { PrismaClient } from '@prisma/client';

// Todo repository implementation
export class TodoRepository extends BaseRepository<Todo, PrismaClient['todo']> {
  constructor() {
    super((prisma) => prisma.todo);
  }
}
