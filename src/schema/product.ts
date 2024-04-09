import z from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  desc: z.string().min(1),
  price: z.coerce.number().min(0),
});

export const updateProductSchema = z.object({
  name: z.string().min(1),
  desc: z.string().min(1),
  price: z.coerce.number().min(0),
  deleteImages: z.array(z.string()).nullish(),
});
