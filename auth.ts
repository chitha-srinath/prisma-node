import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prismaConnection } from './src/utils/database';
import { randomUUID } from 'crypto';
import { bearer, jwt } from 'better-auth/plugins';
import 'dotenv/config';

export const auth = betterAuth({
  database: prismaAdapter(prismaConnection, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production
    autoSignIn: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  advanced: {
    database: {
      generateId: () => randomUUID(),
    },
  },
  cors: {
    origin: [
      'http://localhost:5173', // Vite default
    ],
    credentials: true,
  },
  plugins: [bearer(), jwt()],
  trustedOrigins: [
    'http://localhost:5173', // ← add this line
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
});
