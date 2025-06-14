// import { PrismaClient, Prisma, Todo } from '@prisma/client';

// export class BaseRepository<T extends { id: number }> {
//   protected prisma: PrismaClient;
//   protected getModel: () => any; // Function that returns the appropriate model client

//   constructor(modelSelector: (prisma: PrismaClient) => any) {
//     this.prisma = new PrismaClient();
//     this.getModel = () => modelSelector(this.prisma);
//   }

//   async create(data: T): Promise<T> {
//     return this.getModel().create({ data }) as Promise<T>;
//   }

//   async findAll(): Promise<T[]> {
//     return this.getModel().findMany() as Promise<T[]>;
//   }

//   async findById(id: number): Promise<T | null> {
//     return this.getModel().findUnique({ where: { id } }) as Promise<T | null>;
//   }

//   async update(id: number, data: Partial<T>): Promise<T> {
//     return this.getModel().update({ where: { id }, data }) as Promise<T>;
//   }

//   async delete(id: number): Promise<T> {
//     return this.getModel().delete({ where: { id } }) as Promise<T>;
//   }
// }

import { PrismaClient, Prisma } from '@prisma/client';

export class BaseRepository<T> {
  protected prisma: PrismaClient;
  protected getModel: () => any;

  constructor(modelSelector: (prisma: PrismaClient) => any) {
    this.prisma = new PrismaClient();
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
