import z from "zod";

export const signUpUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(8),
});

export const signInUserSchema = z.object({
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

export type CreateUserType = z.infer<typeof signUpUserSchema>;
