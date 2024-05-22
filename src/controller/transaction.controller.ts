import express from "express";
import { v4 as uuidv4 } from "uuid";
import { midtrans } from "../helpers/midtrans";
import { response } from "../helpers/response";
import { getUserByEmail } from "../model/user/action";
import { getProductById } from "../model/product/action";

export const createProductTransactionController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userEmail = req.session?.email;
  if (!userEmail)
    return response(
      { data: null, statusCode: 400, message: "User session not found" },
      res
    );

  const { id } = req.params;
  if (!id)
    return response(
      { data: null, statusCode: 400, message: "Product ID is missing" },
      res
    );

  const query = req.query;
  const quantity = parseInt(query.quantity as string, 10);

  if (quantity === 0 || !quantity)
    return response(
      { data: null, statusCode: 400, message: "Quantity is missing" },
      res
    );

  try {
    const user = await getUserByEmail(userEmail);
    if (!user)
      return response(
        { data: null, statusCode: 404, message: "User not found" },
        res
      );

    const product = await getProductById(id);
    if (!product)
      return response(
        {
          data: null,
          statusCode: 400,
          message: `Product with id ${id} is not found`,
        },
        res
      );

    const price = product.price * quantity;

    const transactionParameter = {
      transaction_details: {
        order_id: uuidv4(),
        gross_amount: price,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: user?.username,
        email: user?.email,
      },
      item_details: {
        id: id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        category: product.category,
      },
    };
    const snapToken = await midtrans.createTransactionToken(
      transactionParameter
    );

    return response(
      {
        data: { transactionToken: snapToken },
        statusCode: 200,
        message: "Successfully create transaction",
      },
      res
    );
  } catch (error) {
    if (error instanceof Error) return next(error.message);
    next(error);
  }
};
