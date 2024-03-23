import express from "express";
import { authentication, random } from "../helpers/auth";
import { createUser, getUserByEmail } from "../model/user/action";
import { createUserSchema, readUserSchema } from "../schema/user";
import { response } from "../helpers/response";

export const signup = async (req: express.Request, res: express.Response) => {
  const user = createUserSchema.safeParse(req.body);
  if (!user.success)
    return response(
      { data: user.error, statusCode: 400, message: "Bad request" },
      res
    );

  const { email, username, password } = user.data;

  const exisistingUser = await getUserByEmail(email);
  if (exisistingUser)
    return response(
      { data: null, statusCode: 400, message: "Email already used" },
      res
    );

  const salt = random();
  const hashedPassword = authentication(salt, password);
  if (!hashedPassword)
    return response(
      { data: null, statusCode: 400, message: "Password not match" },
      res
    );

  const dbUser = await createUser({
    email,
    username,
    authentication: {
      salt,
      password: hashedPassword,
    },
  });

  return response(
    { data: dbUser, message: "User successfuly created", statusCode: 201 },
    res
  );
};

export const signin = async (req: express.Request, res: express.Response) => {
  const user = readUserSchema.safeParse(req.body);
  if (!user.success)
    return response(
      { data: user.error, statusCode: 400, message: "Bad request" },
      res
    );

  const { email, password } = user.data;

  const existingUser = await getUserByEmail(email).select(
    "+authentication.salt +authentication.password"
  );
  if (!existingUser?.authentication?.salt)
    return response(
      { data: null, statusCode: 500, message: "User not found" },
      res
    );

  const expectedHash = authentication(
    existingUser.authentication.salt,
    password
  );

  if (expectedHash !== existingUser.authentication.salt)
    return response(
      { data: null, statusCode: 403, message: "Password not match" },
      res
    );

  return response(
    { data: user, statusCode: 200, message: "Login access granted" },
    res
  );
};
