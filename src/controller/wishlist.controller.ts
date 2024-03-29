import express from "express";
import { response } from "../helpers/response";
import {
  addWishlist,
  getUserByEmail,
  removeWishlist,
} from "../model/user/action";

export const addWishlistController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userEmail = req.session?.email;
  if (!userEmail)
    return response(
      { data: null, statusCode: 500, message: "User session not found" },
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
    const wishlist = user?.wishlist ?? [];
    const isInclude = wishlist.includes(productId);
    if (isInclude)
      return response(
        {
          data: null,
          statusCode: 400,
          message: "Product already in wishlist",
        },
        res
      );

    const dbUser = await addWishlist(userEmail, productId);
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
      { data: null, statusCode: 500, message: "User session not found" },
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
    const wishlist = user?.wishlist ?? [];
    const isInclude = wishlist.includes(productId);
    if (!isInclude)
      return response(
        {
          data: null,
          statusCode: 400,
          message: "Product is not in wishlist",
        },
        res
      );

    const dbUser = await removeWishlist(userEmail, productId);
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
