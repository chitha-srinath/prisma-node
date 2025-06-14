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

  async create(data: Partial<T>): Promise<T> {
    let result = await this.getModel().create({ data });
    return result;
  }

  async findAll(): Promise<T[]> {
    let result = await this.getModel().findMany();
    return result;
  }

  async findById(id: number): Promise<T | null> {
    let result = this.getModel().findUnique({ where: { id } });
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
}
