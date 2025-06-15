import 'dotenv/config';

const requiredEnvVars = ['PORT', 'DATABASE_URL'] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
} as const;

export type Config = typeof config;
