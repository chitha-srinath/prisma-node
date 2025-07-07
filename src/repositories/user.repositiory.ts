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

  /**
   * Finds the first user matching the query.
   * @param where Query filter
   * @returns The first matching user or null
   */
  async findFirst(where: Prisma.UserWhereInput): Promise<User | null> {
    return this.getModel().findFirst({ where });
  }
}

export class AccountRespository extends BaseRepository<
  User,
  Prisma.AccountCreateInput,
  Prisma.AccountUpdateInput,
  Prisma.AccountWhereInput,
  Prisma.AccountWhereUniqueInput,
  PrismaClient['account']
> {
  /**
   * Initializes the UserRepository with Prisma user model.
   * Sets up the repository to work with the User entity in the database.
   */
  constructor() {
    super((prisma: PrismaClient) => prisma.account);
  }

  /**
   * Finds the first account matching the query.
   * @param where Query filter
   * @returns The first matching account or null
   */
  async findFirst(where: Prisma.AccountWhereInput) {
    return this.getModel().findFirst({ where });
  }
}
