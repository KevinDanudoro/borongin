import express from "express";
import { response } from "../helpers/response";
import { getUserByEmail, updateUserByEmail } from "../model/user/action";

export const addCartController = async (
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

  const { productId } = req.body;
  if (!productId)
    return response(
      { data: null, statusCode: 400, message: "Product ID is mandatory" },
      res
    );

  try {
    const user = await getUserByEmail(userEmail).select({
      "cart.quantity": 1,
      "cart.product": 1,
    });
    if (!user)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "User not found",
        },
        res
      );

    const cartIndex = user.cart.findIndex(
      (c) => c.product?._id.toString() === productId
    );

    if (cartIndex >= 0) {
      const quantity = user.cart.at(cartIndex)?.quantity ?? 1;
      user.cart.set(cartIndex, {
        quantity: quantity + 1,
        product: productId,
      });
    } else {
      user.cart.push({ quantity: 1, product: productId });
    }

    const dbUser = await updateUserByEmail(userEmail, user);
    if (!dbUser) throw new Error("Failed adding product to user cart");

    return response(
      {
        data: dbUser,
        statusCode: 200,
        message: "Successfully adding product to user cart",
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const removeCartController = async (
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

  const { productId } = req.body;
  if (!productId)
    return response(
      { data: null, statusCode: 400, message: "Product ID is mandatory" },
      res
    );

  try {
    const user = await getUserByEmail(userEmail).select({
      "cart.product": 1,
      "cart.quantity": 1,
    });
    if (!user)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "User not found",
        },
        res
      );

    const cartIndex = user.cart.findIndex(
      (u) => u.product._id.toString() === productId
    );
    const quantity = user.cart[cartIndex].quantity;

    if (cartIndex >= 0 && quantity > 1) {
      user.cart.set(cartIndex, {
        quantity: quantity - 1,
        product: productId,
      });
    } else if (cartIndex >= 0 && quantity === 1) {
      user.cart.splice(cartIndex, 1);
    } else {
      return response(
        {
          data: null,
          statusCode: 404,
          message: "Product not found in user cart",
        },
        res
      );
    }

    const dbUser = await updateUserByEmail(userEmail, user);
    if (!dbUser)
      throw new Error(
        `Failed remove product from user cart with email ${userEmail}`
      );

    return response(
      {
        data: dbUser,
        statusCode: 200,
        message:
          "Successfully remove product from user cart with email " + userEmail,
      },
      res
    );
  } catch (error) {
    next(error);
  }
};
