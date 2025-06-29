import 'dotenv/config';

const requiredEnvVars = [
  'PORT',
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
  frontend_url: process.env.FRONTEND_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  security: {
    argon2Options: {
      type: 2,
      memoryCost: parseInt(process.env.ARGON2_MEMORY_COST || '65536'),
      timeCost: parseInt(process.env.ARGON2_TIME_COST || '3'),
      parallelism: parseInt(process.env.ARGON2_PARALLELISM || '1'),
    },
  },
} as const;

export type Config = typeof config;
