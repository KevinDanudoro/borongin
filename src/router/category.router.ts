import express from "express";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryController,
} from "../controller/category.controller";

export default (router: express.Router) => {
  router.get("/category", getCategoryController);
  router.post("/category", createCategoryController);
  router.delete("/category/:id", deleteCategoryController);
};
