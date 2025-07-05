import { z } from 'zod';

/**
 * Zod schema for todo creation validation.
 * Validates required fields for creating a new todo item.
 */
export const createTodoDto = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
});

/**
 * Zod schema for todo update validation.
 * Validates optional fields for updating an existing todo item.
 */
export const updateTodoDto = z.object({
  title: z.string().min(1, { message: 'Title must not be empty' }).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

/**
 * TypeScript type for todo creation request data.
 * Inferred from createTodoDto schema for type safety.
 */
export type CreateTodoData = z.infer<typeof createTodoDto>;

/**
 * TypeScript type for todo update request data.
 * Inferred from updateTodoDto schema for type safety.
 */
export type UpdateTodoData = z.infer<typeof updateTodoDto>;
