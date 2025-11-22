import jwt, { SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { env } from '../config/config';

/**
 * Generates a JWT token with the provided payload and options.
 * Uses the configured JWT access secret for signing.
 * @param payload The data to encode in the JWT token
 * @param options Optional JWT signing options
 * @returns The generated JWT token string
 * @throws Error if JWT access secret is not configured
 */
export function generateJwtToken<T extends string | object | Buffer>(
  payload: T,
  options: SignOptions = {},
): string {
  if (!env.JWT_ACCESS_SECRET) {
    throw new Error('JWT access secret is not configured');
  }
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function generaterefreshToken<T extends string | object | Buffer>(
  payload: T,
  options: SignOptions = {},
): string {
  if (!env.JWT_REFRESH_SECRET) {
    throw new Error('JWT access secret is not configured');
  }
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
}

/**
 * Verifies and decodes a JWT token.
 * Uses the configured JWT access secret for verification.
 * @param token The JWT token string to verify
 * @param options Optional JWT verification options
 * @returns The decoded JWT payload
 * @throws Error if JWT access secret is not configured or token is invalid
 */
export async function verifyJwtToken<T extends JwtPayload>(
  token: string,
  options: VerifyOptions = {},
): Promise<T> {
  if (!env.JWT_ACCESS_SECRET) {
    throw new Error('JWT access secret is not configured');
  }
  return jwt.verify(token, env.JWT_ACCESS_SECRET, options) as T;
}

export async function verifyRefreshToken<T extends JwtPayload>(
  token: string,
  options: VerifyOptions = {},
): Promise<T> {
  if (!env.JWT_REFRESH_SECRET) {
    throw new Error('JWT access secret is not configured');
  }
  return jwt.verify(token, env.JWT_REFRESH_SECRET, options) as T;
}

/**
 * Hashes a password using Argon2id algorithm.
 * Uses configured security parameters for optimal security.
 * @param password The plain text password to hash
 * @returns Promise resolving to the hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: env.ARGON2_MEMORY_COST,
    timeCost: env.ARGON2_TIME_COST,
    parallelism: env.ARGON2_PARALLELISM,
  });

  return hashedPassword;
}

/**
 * Verifies a plain text password against a hashed password.
 * Uses Argon2id for secure password verification.
 * @param password The plain text password to verify
 * @param hashedPassword The hashed password to compare against
 * @returns Promise resolving to true if password matches, false otherwise
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isValid = await argon2.verify(hashedPassword, password);

  return isValid;
}
