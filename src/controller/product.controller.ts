import express from "express";
import { response } from "../helpers/response";
import { createProductSchema } from "../schema/product";
import { createProduct } from "../model/product/action";

export const createProductController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const product = createProductSchema.safeParse(req.body);
  if (!product.success)
    return response(
      { data: null, statusCode: 400, message: "Bad product schema" },
      res
    );

  try {
    const dbProduct = await createProduct(product.data);
    return response(
      {
        data: dbProduct,
        statusCode: 201,
        message: "Successfully create new product",
      },
      res
    );
  } catch (error) {
    next(error);
  }
};
