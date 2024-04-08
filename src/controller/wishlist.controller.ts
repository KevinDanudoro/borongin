import express from "express";
import { response } from "../helpers/response";
import { getUserByEmail, updateUserByEmail } from "../model/user/action";

export const addWishlistController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userEmail = req.session?.email;
  if (!userEmail)
    return response(
      { data: null, statusCode: 404, message: "User session not found" },
      res
    );

  const { productId } = req.body;
  if (!productId)
    return response(
      { data: null, statusCode: 400, message: "Product ID is mandatory" },
      res
    );

  try {
    const user = await getUserByEmail(userEmail).select({ wishlist: 1 });
    if (!user)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "User not found",
        },
        res
      );

    const isInclude = user.wishlist.includes(productId);
    if (isInclude)
      return response(
        {
          data: null,
          statusCode: 400,
          message: "Product already in wishlist",
        },
        res
      );

    user.wishlist.push(productId);
    const dbUser = await updateUserByEmail(userEmail, user);
    if (!dbUser)
      throw new Error(`Failed add wishlists to user with email ${userEmail}`);

    return response(
      {
        data: dbUser,
        statusCode: 200,
        message: "Successfully add wishlists to user with email " + userEmail,
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const removeWishlistController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userEmail = req.session?.email;
  if (!userEmail)
    return response(
      { data: null, statusCode: 404, message: "User session not found" },
      res
    );

  const { productId } = req.body;
  if (!productId)
    return response(
      { data: null, statusCode: 400, message: "Product ID is mandatory" },
      res
    );

  try {
    const user = await getUserByEmail(userEmail).select({ wishlist: 1 });
    if (!user)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "User not found",
        },
        res
      );

    const wishlistIndex = user.wishlist.findIndex(
      (u) => u._id.toString() === productId
    );
    if (wishlistIndex < 0)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "Product not found in wishlist",
        },
        res
      );

    user.wishlist.splice(wishlistIndex, 1);

    const dbUser = await updateUserByEmail(userEmail, user);
    if (!dbUser)
      throw new Error(
        `Failed remove wishlists from user with email ${userEmail}`
      );

    return response(
      {
        data: dbUser,
        statusCode: 200,
        message:
          "Successfully remove wishlists from user with email " + userEmail,
      },
      res
    );
  } catch (error) {
    next(error);
  }
};
