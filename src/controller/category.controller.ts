import express from "express";
import { createCategorySchema } from "../schema/category";
import { response } from "../helpers/response";
import {
  createCategory,
  deleteCategoryById,
  getCategories,
} from "../model/category/action";
import { deleteProductByCategory } from "../model/product/action";

export const createCategoryController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const category = createCategorySchema.safeParse(req.body);
  if (!category.success)
    return response(
      { data: null, statusCode: 400, message: "Bad category schema" },
      res
    );

  try {
    const dbCategories = await createCategory(category.data);
    return response(
      {
        data: dbCategories,
        message: "Success create new category",
        statusCode: 201,
      },
      res
    );
  } catch (error) {
    console.log("error", error);
    next(error);
  }
};

export const getCategoryController = async (
  _: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const dbCategories = await getCategories();
    return response(
      {
        data: dbCategories,
        message: "Success get categories",
        statusCode: 200,
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  if (!id)
    return response(
      { data: null, statusCode: 400, message: "Category ID is mandatory" },
      res
    );

  try {
    const dbCategory = await deleteCategoryById(id);
    if (!dbCategory) throw new Error("Failed delete category");

    const dbProduct = await deleteProductByCategory(dbCategory.name);
    if (!dbProduct)
      throw new Error("Failed to delete product that coresponden to category");

    return response(
      {
        data: { category: dbCategory, product: dbProduct },
        statusCode: 200,
        message: `Successfully delete ${dbCategory.name} category`,
      },
      res
    );
  } catch (error) {
    next(error);
  }
};
