import express from "express";
import { getUserByEmail, updateUserByEmail } from "../model/user/action";
import { updateUserSchema } from "../schema/user";
import { response } from "../helpers/response";

export const updateUserController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userEmail = req.session?.email;
  if (!userEmail)
    return response(
      { data: null, statusCode: 403, message: "User session not found" },
      res
    );

  const user = updateUserSchema.safeParse(req.body);
  if (!user.success)
    return response(
      { data: user.error, statusCode: 400, message: "Bad user schema" },
      res
    );

  try {
    const exisistingUser = await getUserByEmail(userEmail);
    if (exisistingUser)
      return response(
        { data: null, statusCode: 400, message: "Email already used" },
        res
      );

    const dbUser = await updateUserByEmail(userEmail, user.data);
    return response(
      { data: dbUser, message: "User successfuly updated", statusCode: 201 },
      res
    );
  } catch (error) {
    next(error);
  }
};
