// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const createPrismaClient = () =>
  new PrismaClient({
    log: ['warn', 'error'], // Optional: tune for production
  });

export const prismaConnection = globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prismaConnection;
}
