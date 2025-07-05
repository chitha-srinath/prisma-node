import { User, PrismaClient, Prisma } from '@prisma/client';
import { BaseRepository } from './baserepostiory';

/**
 * Repository for User entity operations.
 * Extends BaseRepository to provide type-safe database operations for User model.
 * Handles all CRUD operations and advanced queries for user data.
 */
export class UserRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  Prisma.UserWhereInput,
  Prisma.UserWhereUniqueInput,
  PrismaClient['user']
> {
  /**
   * Initializes the UserRepository with Prisma user model.
   * Sets up the repository to work with the User entity in the database.
   */
  constructor() {
    super((prisma: PrismaClient) => prisma.user);
  }
}
