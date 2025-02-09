import { z } from "zod";

export const CreateAddressValidation = z.object({
  user_id: z.string(),
  street: z.string().min(3, "Nama jalan minimal 3 karakter"),
  city: z.string().min(2, "Nama kota minimal 2 karakter"),
  province: z.string().min(2, "Nama provinsi minimal 2 karakter"),
  postal_code: z.string().length(5, "Kode pos harus 5 karakter"),
});

