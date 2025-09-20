import { PrismaClient } from '@prisma/client';
import { env } from '../config/config';

/**
 * Global type declaration for Prisma client in development mode.
 * Prevents multiple Prisma client instances during hot reloading.
 */
declare global {
  // eslint-disable-next-line no-unused-vars
  var prismaGlobal: PrismaClient | undefined;
}

/**
 * Creates a new Prisma client instance with configured logging.
 * Sets up logging for warnings and errors in production environments.
 * @returns Configured PrismaClient instance
 */
const createPrismaClient = (): PrismaClient => {
  return new PrismaClient({
    log: ['warn', 'error'], // Optional: tune for production
  });
};

/**
 * Global Prisma client connection instance.
 * Uses existing global instance in development to prevent multiple connections.
 */
export const prismaConnection = globalThis.prismaGlobal ?? createPrismaClient();

/**
 * In development mode, stores the Prisma client globally to prevent
 * multiple instances during hot reloading.
 */
if (env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prismaConnection;
}
