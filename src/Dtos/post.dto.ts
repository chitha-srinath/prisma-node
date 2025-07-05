import { z, object, string, boolean } from 'zod';

/**
 * Zod schema for post creation validation.
 * Validates required fields for creating a new post.
 */
export const createPostDto = object({
  title: string().min(1, { message: 'Title is required' }),
  description: string().optional(),
  userId: string({ message: 'User ID is required' }).uuid({ message: 'Invalid user ID format' }),
}).strict();

/**
 * Zod schema for post update validation.
 * Validates optional fields for updating an existing post.
 */
export const updatePostDto = object({
  title: string().min(1, { message: 'Title must not be empty' }).optional(),
  description: string().optional(),
  completed: boolean().optional(),
}).strict();

/**
 * TypeScript type for post creation request data.
 * Inferred from createPostDto schema for type safety.
 */
export type CreatePostData = z.infer<typeof createPostDto>;

/**
 * TypeScript type for post update request data.
 * Inferred from updatePostDto schema for type safety.
 */
export type UpdatePostData = z.infer<typeof updatePostDto>;
