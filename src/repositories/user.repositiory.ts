import { User } from '@prisma/client';
import { BaseRepository } from './baserepostiory';
import { PrismaClient } from '@prisma/client';

// Todo repository implementation
export class UserRepository extends BaseRepository<User, PrismaClient['user']> {
  constructor() {
    super((prisma) => prisma.user);
  }
}
