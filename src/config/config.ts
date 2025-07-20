import 'dotenv/config';
import { z } from 'zod';

/**
 * Environment schema with comprehensive validation using Zod.
 * Defines types, defaults, and validation rules for all environment variables.
 */
const envSchema = z.object({
  // Required core variables
  PORT: z.coerce.number().min(1).max(65535),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT access secret must be at least 16 characters'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT refresh secret must be at least 16 characters'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Optional variables with defaults
  FRONTEND_URL: z.string().url().optional(),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // OAuth credentials (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Security options with defaults
  ARGON2_MEMORY_COST: z.coerce.number().default(65536),
  ARGON2_TIME_COST: z.coerce.number().default(3),
  ARGON2_PARALLELISM: z.coerce.number().default(1),
});

/**
 * Validates environment variables and exits process if validation fails.
 */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  parsed.error.issues.forEach((error) => {
    console.error(`  ${error.path.join('.')}: ${error.message}`);
  });
  process.exit(1);
}

const env = parsed.data;

/**
 * Application configuration object containing all environment-based settings.
 * Includes database connection, JWT settings, OAuth credentials, and security options.
 * All values are validated and type-safe.
 */
export const config = {
  port: env.PORT,
  dbUrl: env.DATABASE_URL,
  frontend_url: env.FRONTEND_URL,
  GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: env.GOOGLE_REDIRECT_URI,
  GITHUB_CLIENT_ID: env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: env.GITHUB_CLIENT_SECRET,
  NODE_ENV: env.NODE_ENV,
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessTokenExpiry: env.JWT_ACCESS_EXPIRY,
    refreshTokenExpiry: env.JWT_REFRESH_EXPIRY,
  },
  security: {
    argon2Options: {
      type: 2 as const,
      memoryCost: env.ARGON2_MEMORY_COST,
      timeCost: env.ARGON2_TIME_COST,
      parallelism: env.ARGON2_PARALLELISM,
    },
  },
} as const;

// /**
//  * Type definition for the configuration object.
//  * Provides type safety for configuration access throughout the application.
//  */
// export type Config = typeof config;
