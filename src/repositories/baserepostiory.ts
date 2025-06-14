import { PrismaClient } from '@prisma/client';
import { prismaConnection } from '../utils/database';

type ModelDelegate<T> = {
  create: (args: { data: Partial<T> }) => Promise<T>;
  findMany: (args?: any) => Promise<T[]>;
  findUnique: (args: any) => Promise<T | null>;
  update: (args: { where: any; data: Partial<T> }) => Promise<T>;
  delete: (args: { where: any }) => Promise<T>;
};

export class BaseRepository<T> {
  protected prisma: PrismaClient;
  protected getModel: () => any;
  constructor(modelSelector: (prisma: PrismaClient) => any) {
    this.prisma = prismaConnection;
    this.getModel = () => modelSelector(this.prisma);
  }

  async insert(data: Partial<T>): Promise<T> {
    let result = await this.getModel().create({ data });
    return result;
  }

  async insertMany(data: Partial<T>, duplicate: boolean = true): Promise<T> {
    let result = await this.getModel().createMany({ data, skipDuplicates: duplicate });
    return result;
  }

  async upsert(data: Partial<T>, update: Partial<T>) {
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
    let result = await this.getModel().findMany({
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
    let result = this.getModel().findUnique({
      where: { id },
      ...(select && { select }),
      ...(include && { include }),
    });
    return result;
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    let result = this.getModel().update({ where: { id }, data });
    return result;
  }

  async delete(id: number): Promise<T> {
    let result = this.getModel().delete({ where: { id } });
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
  ): Promise<{ data: T[]; total: number }> {
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

  async groupData(groupByQuery: any) {
    const result = this.getModel().groupBy(groupByQuery);
    return result;
  }

  async aggaregatedData(Query: any) {
    const result = this.getModel().aggaregate(Query);
    return result;
  }
}
