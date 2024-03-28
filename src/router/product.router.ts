import { createProductController } from "../controller/product.controller";
import express from "express";

export default (router: express.Router) => {
  router.post("/product", createProductController);
};
