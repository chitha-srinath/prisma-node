import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string(),
  password: z.string().min(6),
});

export const UserSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
});

export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
export type UserSchema = z.infer<typeof UserSchema>;
