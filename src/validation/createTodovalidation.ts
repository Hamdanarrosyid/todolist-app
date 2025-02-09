import { z } from "zod";

export const CreateTodoValidation = z.object({
  user_id: z.string(),
  title: z.string().min(3, "Title harus minimal 3 karakter"),
  description: z.string().optional(),
});