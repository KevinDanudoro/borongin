import express from "express";
import { v4 as uuidv4 } from "uuid";
import { midtrans } from "../helpers/midtrans";
import { response } from "../helpers/response";
import { getUserByEmail } from "../model/user/action";
import { PopulatedUserCart } from "../model/user/types";

export const createTransactionController = async (
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

  try {
    const user = await getUserByEmail(userEmail)
      .select("+cart.product +cart.quantity")
      .populate<PopulatedUserCart>("cart.product");

    const price = user?.cart
      .map((c) => c.quantity * c.product.price)
      .reduce((a, b) => a + b);

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
