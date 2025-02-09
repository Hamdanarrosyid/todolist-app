import { z } from "zod";

export const CreateUserValidation = z.object({
  firstname: z.string().min(2, "Minimal 2 karakter"),
  lastname: z.string().min(2, "Minimal 2 karakter"),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format harus MM-DD-YYYY"),
});
