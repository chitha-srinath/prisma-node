import { z } from 'zod';

/**
 * Zod schema for user creation validation.
 * Validates required fields for creating a new user account.
 */
export const createUserDto = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Enter valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  emailVerified: z.boolean().default(false),
});

/**
 * Zod schema for user update validation.
 * Validates optional fields for updating an existing user.
 */
export const updateUserDto = z.object({
  name: z.string().min(1, { message: 'Name must not be empty' }).optional(),
});

/**
 * TypeScript type for user creation request data.
 * Inferred from createUserDto schema for type safety.
 */
export type CreateUserData = z.infer<typeof createUserDto>;

/**
 * TypeScript type for user update request data.
 * Inferred from updateUserDto schema for type safety.
 */
export type UpdateUserData = z.infer<typeof updateUserDto>;
