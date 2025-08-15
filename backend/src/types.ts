// backend/src/types.ts
import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().default(""),
  completed: z.boolean(),
  updatedAt: z.number(),
});
export type Task = z.infer<typeof TaskSchema>;

export const TaskInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
});
export type TaskInput = z.infer<typeof TaskInputSchema>;

export const TaskPatchSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "Empty patch" });
export type TaskPatch = z.infer<typeof TaskPatchSchema>;
