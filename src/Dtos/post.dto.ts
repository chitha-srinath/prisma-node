import { z, object, string, boolean } from 'zod';

export const createPostDto = object({
  title: string().min(1),
  description: string().optional(),
  userId: string({ message: 'user id is a string' }).uuid({ message: 'invalid user id' }),
}).strict();

export const updatePostDto = object({
  title: string().min(1).optional(),
  description: string().optional(),
  completed: boolean().optional(),
}).strict();

export type CreatePostData = z.infer<typeof createPostDto>;
export type UpdatePostData = z.infer<typeof updatePostDto>;
