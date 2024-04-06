import { upload } from "../middleware";
import {
  createProductController,
  deleteProductByIdController,
  getProductByIdController,
  getProductsController,
  updateProductByIdController,
} from "../controller/product.controller";
import express from "express";

export default (router: express.Router) => {
  router.post("/product", createProductController);
  router.get("/product", getProductsController);
  router.get("/product/:id", getProductByIdController);
  router.put(
    "/product/:id",
    upload.array("image"),
    updateProductByIdController
  );
  router.delete("/product/:id", deleteProductByIdController);
};
