import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prismaConnection } from './database';
import { randomUUID } from 'crypto';

export const auth = betterAuth({
  database: prismaAdapter(prismaConnection, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  advanced: {
    generateId: () => randomUUID(),
  },
  plugins: [],
});
