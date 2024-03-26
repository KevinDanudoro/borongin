import z from "zod";

const authentication = z.object({
  password: z.string().min(8),
  salt: z.string().nullish(),
});

export const userSchema = z.object({
  username: z.string().min(1),
  email: z.string().email().min(1),
  authentication,
});

export const createUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(8),
});

export const readUserSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(8),
});

export const jwtUserSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email().min(1),
  iat: z.number(),
  exp: z.number(),
});

export type CreateUserType = z.infer<typeof createUserSchema>;
