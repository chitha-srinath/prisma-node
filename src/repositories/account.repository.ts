import { Account, PrismaClient, Prisma } from '@prisma/client';
import { BaseRepository } from './baserepostiory';
import { randomUUID } from 'node:crypto';

/**
 * Repository for Account entity operations.
 * Extends BaseRepository to provide type-safe database operations for Account model.
 * Handles all CRUD operations and advanced queries for account data.
 */
export class AccountRepository extends BaseRepository<
  Account,
  Prisma.AccountCreateInput,
  Prisma.AccountUpdateInput,
  Prisma.AccountWhereInput,
  Prisma.AccountWhereUniqueInput,
  PrismaClient['account']
> {
  /**
   * Initializes the AccountRepository with Prisma account model.
   * Sets up the repository to work with the Account entity in the database.
   */
  constructor() {
    super((prisma: PrismaClient) => prisma.account);
  }

  /**
   * Finds the first account matching the query.
   * @param where Query filter
   * @returns The first matching account or null
   */
  async findFirst(where: Prisma.AccountWhereInput): Promise<Account | null> {
    return this.getModel().findFirst({ where });
  }

  /**
   * Finds accounts by user ID and provider.
   * @param userId User ID to search for
   * @param providerId Provider ID (e.g., 'credentials', 'google', 'github')
   * @returns Array of matching accounts
   */
  async findByUserAndProvider(userId: string, providerId: string): Promise<Account[]> {
    return this.getModel().findMany({
      where: {
        userId,
        providerId,
      },
    });
  }

  /**
   * Creates a password account for a user.
   * @param userId User ID
   * @param hashedPassword Hashed password string
   * @returns Created account
   */
  async createPasswordAccount(userId: string, hashedPassword: string): Promise<Account> {
    return this.getModel().create({
      data: {
        id: randomUUID(),
        accountId: userId,
        providerId: 'credentials',
        userId,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
