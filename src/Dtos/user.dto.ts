import { z } from 'zod';

export const createUserDto = z.object({
  name: z.string().min(1),
  email: z.string(),
  password: z.string().min(6),
});

export const updateUserDto = z.object({
  name: z.string().min(1).optional(),
});

export type CreateUserData = z.infer<typeof createUserDto>;
export type UpdateUserData = z.infer<typeof updateUserDto>;
