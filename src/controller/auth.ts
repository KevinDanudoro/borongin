import express from "express";
import { authentication, random } from "../helpers/auth";
import { createUser, getUserByEmail } from "../model/user/action";
import { createUserSchema } from "../schema/user";

export const signup = async (req: express.Request, res: express.Response) => {
  const user = createUserSchema.safeParse(req.body);
  if (!user.success) return res.status(400).json(user.error);

  const { email, username, password } = user.data;

  const exisistingUser = await getUserByEmail(email);
  if (exisistingUser) return res.sendStatus(400);

  const salt = random();
  const hashedPassword = authentication(salt, password);
  if (!hashedPassword) return res.sendStatus(500);

  const dbUser = await createUser({
    email,
    username,
    authentication: {
      salt,
      password: hashedPassword,
    },
  });

  return res.status(201).json(dbUser).end();
};
