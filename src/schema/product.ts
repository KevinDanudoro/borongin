import z from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  desc: z.string().min(1),
  price: z.number().min(0),
  imageUrl: z.string().min(1),
});
