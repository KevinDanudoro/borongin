import z from "zod";

const authentication = z.object({
  password: z.string().min(1),
  sessionToken: z.string().nullish(),
  salt: z.string().nullish(),
});

export const createUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(8),
});

export type CreateUserType = z.infer<typeof createUserSchema>;
