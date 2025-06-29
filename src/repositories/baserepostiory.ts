import { PrismaClient } from '@prisma/client';
import { prismaConnection } from '../utils/database';

export class BaseRepository<T, M> {
  protected prisma: PrismaClient;
  protected getModel: () => M;
  constructor(modelSelector: (prisma: PrismaClient) => M) {
    this.prisma = prismaConnection;
    this.getModel = () => modelSelector(this.prisma);
  }

  async insert(data: Partial<T>): Promise<T> {
    // @ts-expect-error Prisma does not export a shared delegate interface
    const result = await this.getModel().create({ data });
    return result;
  }

  async insertMany(data: Partial<T>, duplicate = true): Promise<{ count: number }> {
    // @ts-expect-error Prisma does not export a shared delegate interface
    const result = await this.getModel().createMany({ data, skipDuplicates: duplicate });
    return result;
  }

  async upsert(data: Partial<T>, update: Partial<T>): Promise<T> {
    // @ts-expect-error Prisma does not export a shared delegate interface
    const result = await this.getModel().upsert({
      where: data,
      update: update,
      create: {
        ...data,
        ...update,
      },
    });
    return result;
  }

  async findAll(
    data?: Partial<T>,
    select?: Record<string, boolean>,
    include?: Record<string, boolean>,
    sort?: {
      field: keyof T;
      order: 'asc' | 'desc';
    },
  ): Promise<T[]> {
    // @ts-expect-error Prisma does not export a shared delegate interface
    const result = await this.getModel().findMany({
      where: data,
      ...(sort && {
        orderBy: {
          [sort.field]: sort.order,
        },
      }),
      ...(select && { select }),
      ...(include && { include }),
    });
    return result;
  }

  async findById(
    id: number,
    select?: Record<string, boolean>,
    include?: Record<string, boolean>,
  ): Promise<T | null> {
    // @ts-expect-error Prisma does not export a shared delegate interface
    const result = this.getModel().findUnique({
      where: { id },
      ...(select && { select }),
      ...(include && { include }),
    });
    return result;
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    // @ts-expect-error Prisma does not export a shared delegate interface
    const result = this.getModel().update({ where: { id }, data });
    return result;
  }

  async delete(id: number): Promise<T> {
    // @ts-expect-error Prisma does not export a shared delegate interface
    const result = this.getModel().delete({ where: { id } });
    return result;
  }

  async getPaginatedResult(
    data: Partial<T>,
    skip = 0,
    limit = 10,
    select?: Record<string, boolean>,
    include?: Record<string, boolean>,
    sort?: {
      field: keyof T;
      order: 'asc' | 'desc';
    },
  ): Promise<T[]> {
    // @ts-expect-error Prisma does not export a shared delegate interface
    const result = this.getModel().findMany({
      where: data,
      ...(sort && {
        orderBy: {
          [sort.field]: sort.order,
        },
      }),
      skip,
      take: limit,
      ...(select && { select }),
      ...(include && { include }),
    });

    return result;
  }

  async groupData(groupByQuery: {
    by: string[];
    _count?: boolean;
    _sum?: boolean;
    _avg?: boolean;
  }): Promise<unknown> {
    // @ts-expect-error Prisma does not export a shared delegate interface
    const result = await this.getModel().groupBy?.(groupByQuery);
    return result ?? [];
  }

  async aggaregatedData(query: {
    _count?: boolean;
    _sum?: boolean;
    _avg?: boolean;
    _min?: boolean;
    _max?: boolean;
  }): Promise<unknown> {
    // @ts-expect-error Prisma does not export a shared delegate interface
    const result = await this.getModel().aggregate?.(query);
    return result ?? null;
  }
}
