import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  userId: z.number(),
});

export const PostSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export type CreatePostData = z.infer<typeof createPostSchema>;
export type UpdatePostData = z.infer<typeof updatePostSchema>;
export type PostSchema = z.infer<typeof PostSchema>;
