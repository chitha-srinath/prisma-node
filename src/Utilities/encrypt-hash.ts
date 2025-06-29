import jwt, { SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { config } from '../config/config';

/**
 * Generate JWT token
 */
export function generateJwtToken<T extends string | object | Buffer>(
  payload: T,
  options: SignOptions = {},
): string {
  if (!config.jwt.accessSecret) {
    throw new Error('JWT access secret is not configured');
  }
  return jwt.sign(payload, config.jwt.accessSecret, options);
}

/**
 * Verify JWT token
 */
export async function verifyJwtToken<T extends JwtPayload>(
  token: string,
  options: VerifyOptions = {},
): Promise<T> {
  if (!config.jwt.accessSecret) {
    throw new Error('JWT access secret is not configured');
  }
  return jwt.verify(token, config.jwt.accessSecret, options) as T;
}

/**
 * Hash password using Argon2id
 */
export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: config.security.argon2Options.memoryCost,
    timeCost: config.security.argon2Options.timeCost,
    parallelism: config.security.argon2Options.parallelism,
  });

  return hashedPassword;
}

/**
 * Verify password against hashed password
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isValid = await argon2.verify(hashedPassword, password);

  return isValid;
}
