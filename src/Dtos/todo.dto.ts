import { z } from 'zod';

export const createTodoDto = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const updateTodoDto = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export type CreateTodoData = z.infer<typeof createTodoDto>;
export type UpdateTodoData = z.infer<typeof updateTodoDto>;
