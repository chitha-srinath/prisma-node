import 'dotenv/config';

/**
 * Array of required environment variables that must be present for the application to start.
 * Throws an error if any of these variables are missing.
 */
const requiredEnvVars = [
  'PORT',
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
] as const;

/**
 * Validates that all required environment variables are present.
 * Throws an error if any required variable is missing.
 */
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

/**
 * Application configuration object containing all environment-based settings.
 * Includes database connection, JWT settings, OAuth credentials, and security options.
 */
export const config = {
  port: process.env.PORT,
  dbUrl: process.env.DATABASE_URL,
  frontend_url: process.env.FRONTEND_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
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

/**
 * Type definition for the configuration object.
 * Provides type safety for configuration access throughout the application.
 */
export type Config = typeof config;
