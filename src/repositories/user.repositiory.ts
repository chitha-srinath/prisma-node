import { User, PrismaClient, Prisma, Session, Account } from '@prisma/client';
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

  /**
   * Finds user by email with accounts.
   * @param email User email
   * @returns User with accounts or null
   */
  async findByEmailWithAccounts(
    email: string,
  ): Promise<(User & { accounts: { password: string | null }[] }) | null> {
    return this.getModel().findFirst({
      where: { email },
      include: {
        accounts: {
          where: { providerId: 'credentials' },
          select: { password: true },
        },
      },
    });
  }

  /**
   * Creates a new user with the provided data.
   * @param data User creation data
   * @returns Created user
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.getModel().create({ data });
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

  async findFirst(where: Prisma.AccountWhereInput): Promise<Account | null> {
    return this.getModel().findFirst({ where });
  }
}

export class SessionRepository extends BaseRepository<
  Session,
  Prisma.SessionCreateInput,
  Prisma.SessionUpdateInput,
  Prisma.SessionWhereInput,
  Prisma.SessionWhereUniqueInput,
  PrismaClient['session']
> {
  /**
   * Initializes the UserRepository with Prisma user model.
   * Sets up the repository to work with the User entity in the database.
   */
  constructor() {
    super((prisma: PrismaClient) => prisma.session);
  }
}
