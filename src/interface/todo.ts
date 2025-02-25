import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const TodoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export type CreateTodoData = z.infer<typeof createTodoSchema>;
export type UpdateTodoData = z.infer<typeof updateTodoSchema>;
export type TodoSchema = z.infer<typeof TodoSchema>;