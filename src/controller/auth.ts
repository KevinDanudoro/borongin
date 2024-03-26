import express from "express";
import jwt from "jsonwebtoken";
import { authentication, generateSalt } from "../helpers/hashing";
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

  const salt = generateSalt();
  const hashedPassword = authentication(password, salt);
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
    "+authentication.password +authentication.salt"
  );

  if (
    !existingUser?.authentication?.password ||
    !existingUser?.authentication?.salt
  ) {
    return response(
      { data: null, statusCode: 500, message: "Internal server error" },
      res
    );
  }

  const isPasswordSame =
    authentication(password, existingUser.authentication.salt) ===
    existingUser.authentication.password;

  if (!isPasswordSame)
    return response(
      { data: null, statusCode: 403, message: "Credential error" },
      res
    );

  const token = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
    },
    process.env.SECRET || "",
    { expiresIn: 3600 }
  );
  res.cookie("Authentication", token, {
    maxAge: 3600,
    httpOnly: true,
    sameSite: true,
  });

  return response(
    { data: existingUser, statusCode: 200, message: "Login access granted" },
    res
  );
};
