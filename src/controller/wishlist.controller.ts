import express from "express";
import { response } from "../helpers/response";
import { getProductById } from "../model/product/action";
import { addWishlist } from "../model/user/action";

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
    const dbProduct = await getProductById(productId);
    if (!dbProduct)
      throw new Error(`Product with id ${productId} is not found`);

    const dbUser = await addWishlist(userEmail, dbProduct);
    if (!dbUser)
      throw new Error(`Failed add wishlists to user with email ${userEmail}`);

    return response(
      {
        data: dbProduct,
        statusCode: 200,
        message: "Successfully add wishlists to user with email " + userEmail,
      },
      res
    );
  } catch (error) {
    next(error);
  }
};
