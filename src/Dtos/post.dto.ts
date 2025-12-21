import { z, object, string, boolean, number, uuid, union } from 'zod/v4';
import { BaseDto } from './base.dto';

/**
 * Zod schema for todo creation validation.
 */
export const createPostDto = object({
  title: string({
    message: 'Title is required',
  }).min(2, 'Title should be more than 1 character'),
  description: string().optional(),
}).strict();

/**
 * Zod schema for todo update validation.
 */
export const updatePostDto = object({
  title: string().min(2, 'Title should be more than 1 character').optional(),
  description: string().optional(),
  completed: boolean().optional(),
}).strict();

/**
 * Base schema for p  ost retrieval (shared fields)
 */
export const basePostDto = {
  limit: number({
    message: 'Limit must be a number',
  }),
  search: string().min(1, 'Search term is required').optional(),
};

/**
 * Page-based pagination
 */
const pageSchema = object({
  page: number({
    message: 'Page must be a number',
  }),
  ...basePostDto,
}).strict();

/**
 * Cursor-based pagination
 */
const cursorSchema = object({
  cursor: uuid({
    message: 'Cursor id is invalid',
  }),
  ...basePostDto,
}).strict();

/**
 * Post retrieval DTO
 * Either page OR cursor (never both)
 */
export const getPostsDto = union([pageSchema, cursorSchema]);

/**
 * Zod schema for post deletion validation.
 */
export const deletePostDto = object({
  postId: uuid({
    message: 'Invalid post id',
  }),
}).strict();

/**
 * TypeScript inferred types
 */
export type CreatePostData = z.infer<typeof createPostDto> & BaseDto;
export type UpdatePostData = z.infer<typeof updatePostDto> & BaseDto;
export type DeletePostData = z.infer<typeof deletePostDto> & BaseDto;
export type GetPostsData = z.infer<typeof getPostsDto> & BaseDto;
