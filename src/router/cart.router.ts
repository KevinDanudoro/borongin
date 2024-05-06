import express from "express";
import {
  addCartController,
  getCartController,
  removeCartController,
} from "../controller/cart.controller";

export default (router: express.Router) => {
  router.get("/cart", getCartController);
  router.post("/cart", addCartController);
  router.delete("/cart", removeCartController);
};
