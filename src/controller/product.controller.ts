import express from "express";
import { response } from "../helpers/response";
import { createProductSchema, updateProductSchema } from "../schema/product";
import {
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
} from "../model/product/action";

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

export const getProductsController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const dbProducts = await getProducts();
    return response(
      {
        data: dbProducts,
        statusCode: 200,
        message: "Successfully get all products",
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const getProductByIdController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  if (!id)
    return response(
      { data: null, statusCode: 400, message: "Product ID is mandatory" },
      res
    );

  try {
    const dbProduct = await getProductById(id);
    return response(
      {
        data: dbProduct,
        statusCode: 200,
        message: "Successfully get product with id " + id,
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const updateProductByIdController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  if (!id)
    return response(
      { data: null, statusCode: 400, message: "Product ID is mandatory" },
      res
    );

  const updatedProduct = updateProductSchema.safeParse(req.body);
  if (!updatedProduct.success)
    return response(
      { data: null, statusCode: 400, message: "Bad product schema" },
      res
    );

  try {
    const dbProduct = await updateProductById(id, updatedProduct.data);
    return response(
      {
        data: dbProduct,
        statusCode: 201,
        message: "Successfully update product with id " + id,
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const deleteProductByIdController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  if (!id)
    return response(
      { data: null, statusCode: 400, message: "Product ID is mandatory" },
      res
    );

  try {
    const dbProduct = await deleteProductById(id);
    return response(
      {
        data: dbProduct,
        statusCode: 200,
        message: "Successfully delete product with id " + id,
      },
      res
    );
  } catch (error) {
    next(error);
  }
};
