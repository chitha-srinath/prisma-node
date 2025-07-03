import { PrismaClient } from '@prisma/client';
import { prismaConnection } from '../utils/database';

// Define the common Prisma model interface with proper generic constraints
interface PrismaModel<T, CreateInput, UpdateInput, WhereInput, WhereUniqueInput> {
  create: (args: { data: CreateInput }) => Promise<T>;
  createMany: (args: {
    data: CreateInput[];
    skipDuplicates?: boolean;
  }) => Promise<{ count: number }>;
  upsert: (args: {
    where: WhereUniqueInput;
    update: UpdateInput;
    create: CreateInput;
  }) => Promise<T>;
  findMany: (args?: {
    where?: WhereInput;
    select?: Record<string, boolean>;
    include?: Record<string, boolean>;
    orderBy?: Record<string, 'asc' | 'desc'>;
    skip?: number;
    take?: number;
  }) => Promise<T[]>;
  findUnique: (args: {
    where: WhereUniqueInput;
    select?: Record<string, boolean>;
    include?: Record<string, boolean>;
  }) => Promise<T | null>;
  update: (args: {
    where: WhereUniqueInput;
    data: UpdateInput;
    select?: Record<string, boolean>;
    include?: Record<string, boolean>;
  }) => Promise<T>;
  updateMany: (args: { where: WhereInput; data: UpdateInput }) => Promise<{ count: number }>;
  delete: (args: { where: WhereUniqueInput }) => Promise<T>;
  groupBy?: (args: {
    by: string[];
    _count?: boolean;
    _sum?: Record<string, boolean>;
    _avg?: Record<string, boolean>;
  }) => Promise<unknown>;
  aggregate?: (args: {
    _count?: boolean;
    _sum?: Record<string, boolean>;
    _avg?: Record<string, boolean>;
    _min?: Record<string, boolean>;
    _max?: Record<string, boolean>;
  }) => Promise<unknown>;
}

/**
 * Generic base repository for Prisma models.
 * Provides common CRUD and utility operations for any entity.
 * @template T Entity type
 * @template CreateInput Prisma create input type
 * @template UpdateInput Prisma update input type
 * @template WhereInput Prisma where input type
 * @template WhereUniqueInput Prisma where unique input type
 * @template M Prisma model type
 */
export class BaseRepository<
  T,
  CreateInput,
  UpdateInput,
  WhereInput,
  WhereUniqueInput,
  M extends PrismaModel<T, CreateInput, UpdateInput, WhereInput, WhereUniqueInput>,
> {
  protected prisma: PrismaClient;
  protected getModel: () => M;

  /**
   * Initializes the repository with a Prisma model selector.
   * @param modelSelector Function to select the Prisma model from the Prisma client
   */
  constructor(modelSelector: (prisma: PrismaClient) => M) {
    this.prisma = prismaConnection;
    this.getModel = (): M => modelSelector(this.prisma);
  }

  /**
   * Inserts a new entity into the database.
   * @param data Entity creation data
   * @returns The created entity
   */
  async insert(data: CreateInput): Promise<T> {
    const result = await this.getModel().create({ data });
    return result;
  }

  /**
   * Inserts multiple entities into the database.
   * @param data Array of entity creation data
   * @param skipDuplicates Whether to skip duplicates
   * @returns Object with count of inserted records
   */
  async insertMany(data: CreateInput[], skipDuplicates = true): Promise<{ count: number }> {
    const result = await this.getModel().createMany({ data, skipDuplicates });
    return result;
  }

  /**
   * Upserts (inserts or updates) an entity.
   * @param where Unique identifier for the entity
   * @param update Data to update if entity exists
   * @param create Data to create if entity doesn't exist
   * @returns The upserted entity
   */
  async upsert(where: WhereUniqueInput, update: UpdateInput, create: CreateInput): Promise<T> {
    const result = await this.getModel().upsert({
      where,
      update,
      create,
    });
    return result;
  }

  /**
   * Finds all entities matching the query.
   * @param where Query filter
   * @param select Fields to select
   * @param include Related entities to include
   * @param orderBy Sorting options
   * @returns Array of entities
   */
  async findAll(
    where?: WhereInput,
    select?: Record<string, boolean>,
    include?: Record<string, boolean>,
    orderBy?: Record<string, 'asc' | 'desc'>,
  ): Promise<T[]> {
    const result = await this.getModel().findMany({
      where,
      ...(orderBy && { orderBy }),
      ...(select && { select }),
      ...(include && { include }),
    });
    return result;
  }

  /**
   * Finds an entity by its unique identifier.
   * @param where Unique identifier
   * @param select Fields to select
   * @param include Related entities to include
   * @returns The entity or null if not found
   */
  async findUnique(
    where: WhereUniqueInput,
    select?: Record<string, boolean>,
    include?: Record<string, boolean>,
  ): Promise<T | null> {
    const result = await this.getModel().findUnique({
      where,
      ...(select && { select }),
      ...(include && { include }),
    });
    return result;
  }

  /**
   * Finds an entity by its ID.
   * @param id Entity ID
   * @param select Fields to select
   * @param include Related entities to include
   * @returns The entity or null if not found
   */
  async findById(
    id: number,
    select?: Record<string, boolean>,
    include?: Record<string, boolean>,
  ): Promise<T | null> {
    const result = await this.getModel().findUnique({
      where: { id } as WhereUniqueInput,
      ...(select && { select }),
      ...(include && { include }),
    });
    return result;
  }

  /**
   * Updates an entity matching the unique identifier.
   * @param where Unique identifier to match entity
   * @param data Data to update
   * @param select Fields to select
   * @param include Related entities to include
   * @returns The updated entity
   */
  async update(
    where: WhereUniqueInput,
    data: UpdateInput,
    select?: Record<string, boolean>,
    include?: Record<string, boolean>,
  ): Promise<T> {
    const result = await this.getModel().update({
      where,
      data,
      ...(select && { select }),
      ...(include && { include }),
    });
    return result;
  }

  /**
   * Updates multiple entities matching the query.
   * @param where Query to match entities
   * @param data Data to update
   * @returns Object with count of updated records
   */
  async updateMany(where: WhereInput, data: UpdateInput): Promise<{ count: number }> {
    const result = await this.getModel().updateMany({ where, data });
    return result;
  }

  /**
   * Deletes an entity by its unique identifier.
   * @param where Unique identifier
   * @returns The deleted entity
   */
  async deleteUnique(where: WhereUniqueInput): Promise<T> {
    const result = await this.getModel().delete({ where });
    return result;
  }

  /**
   * Deletes an entity by its ID.
   * @param id Entity ID
   * @returns The deleted entity
   */
  async delete(id: number): Promise<T> {
    const result = await this.getModel().delete({ where: { id } as WhereUniqueInput });
    return result;
  }

  /**
   * Retrieves paginated results for a query.
   * @param where Query filter
   * @param skip Number of records to skip
   * @param take Number of records to return
   * @param select Fields to select
   * @param include Related entities to include
   * @param orderBy Sorting options
   * @returns Array of entities
   */
  async getPaginatedResult(
    where?: WhereInput,
    skip = 0,
    take = 10,
    select?: Record<string, boolean>,
    include?: Record<string, boolean>,
    orderBy?: Record<string, 'asc' | 'desc'>,
  ): Promise<T[]> {
    const result = await this.getModel().findMany({
      where,
      ...(orderBy && { orderBy }),
      skip,
      take,
      ...(select && { select }),
      ...(include && { include }),
    });
    return result;
  }

  /**
   * Groups data by specified fields.
   * @param groupByQuery Group by query object
   * @returns Grouped data
   */
  async groupData(groupByQuery: {
    by: string[];
    _count?: boolean;
    _sum?: Record<string, boolean>;
    _avg?: Record<string, boolean>;
  }): Promise<unknown> {
    const model = this.getModel();
    if (!model.groupBy) {
      throw new Error('GroupBy operation not supported for this model');
    }
    const result = await model.groupBy(groupByQuery);
    return result ?? [];
  }

  /**
   * Performs aggregation queries.
   * @param query Aggregation query object
   * @returns Aggregated data
   */
  async aggregatedData(query: {
    _count?: boolean;
    _sum?: Record<string, boolean>;
    _avg?: Record<string, boolean>;
    _min?: Record<string, boolean>;
    _max?: Record<string, boolean>;
  }): Promise<unknown> {
    const model = this.getModel();
    if (!model.aggregate) {
      throw new Error('Aggregate operation not supported for this model');
    }
    const result = await model.aggregate(query);
    return result ?? null;
  }
}
