import { z, object, string } from 'zod';

/**
 * Zod schema for user login validation.
 * Validates email format and password length requirements.
 */
export const LoginDto = object({
  email: string().email({ message: 'Enter valid email' }),
  password: string()
    .min(6, { message: 'Password length should be minimum of 6 characters' })
    .max(64, { message: 'Password length should be maximum of 64 characters' }),
}).strict();

/**
 * Zod schema for user registration validation.
 * Validates email format and password length requirements.
 */
export const RegisterDto = object({
  email: string().email({ message: 'Enter valid email' }),
  password: string()
    .min(6, { message: 'Password length should be minimum of 6 characters' })
    .max(64, { message: 'Password length should be maximum of 64 characters' }),
}).strict();

/**
 * TypeScript type for login request data.
 * Inferred from LoginDto schema for type safety.
 */
export type LoginPostDto = z.infer<typeof LoginDto>;

/**
 * TypeScript type for registration request data.
 * Inferred from RegisterDto schema for type safety.
 */
export type RegisterPostDto = z.infer<typeof RegisterDto>;
