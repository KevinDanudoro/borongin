import express from "express";
import {
  deleteUserById,
  getUserByEmail,
  updateUserByEmail,
} from "../model/user/action";
import { updateUserSchema } from "../schema/user";
import { response } from "../helpers/response";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../helpers/cloudinary";

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
    if (!exisistingUser)
      return response(
        { data: null, statusCode: 404, message: "User not found" },
        res
      );

    const isDelSuccess = await deleteFromCloudinary(
      exisistingUser.image ? [exisistingUser.image] : []
    );
    if (!isDelSuccess) throw new Error("Failed delete resource from cloud");

    const image = req.file as { buffer: Buffer };
    const uploadUrl = await uploadToCloudinary([image], { folder: "user" });

    const dbUser = await updateUserByEmail(userEmail, {
      ...user.data,
      image: uploadUrl[0],
    });
    return response(
      { data: dbUser, message: "User successfuly updated", statusCode: 201 },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (
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

  try {
    const exisistingUser = await getUserByEmail(userEmail);
    if (!exisistingUser)
      return response(
        { data: null, statusCode: 404, message: "User not found" },
        res
      );

    if (exisistingUser.image) {
      const isDelSuccess = await deleteFromCloudinary([exisistingUser.image]);
      if (!isDelSuccess)
        throw new Error("Failed delete product image from cloud");
    }

    const deletedUser = await deleteUserById(exisistingUser?._id);
    if (!deletedUser)
      return response(
        { data: null, statusCode: 500, message: "Failed to delete user" },
        res
      );

    return response(
      {
        data: deletedUser,
        statusCode: 200,
        message: "Successfully delete user",
      },
      res
    );
  } catch (error) {
    next(error);
  }
};
