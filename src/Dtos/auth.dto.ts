import { z, object, string, email } from 'zod/v4';

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
 * Validates email format, password length requirements, and name.
 */
export const RegisterDto = object({
  username: string().min(1, { message: 'Name is required' }),
  email: email({ message: 'Enter valid email' }),
  password: string()
    .min(6, { message: 'Password length should be minimum of 6 characters' })
    .max(64, { message: 'Password length should be maximum of 64 characters' }),
}).strict();

/**
 * Zod schema for authentication response.
 * Contains user info and access token.
 */
export const AuthResponseDto = object({
  user: object({
    id: string(),
    name: string(),
    email: string(),
    emailVerified: z.boolean().nullable(),
    image: string().nullable(),
    isActive: z.boolean(),
  }),
  accessToken: string(),
  refreshToken: string(),
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

/**
 * TypeScript type for authentication response data.
 * Inferred from AuthResponseDto schema for type safety.
 */
export type AuthResponse = z.infer<typeof AuthResponseDto>;
