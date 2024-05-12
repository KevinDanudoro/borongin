import express from "express";
import {
  addCartController,
  getCartController,
  removeCartController,
  setCartQuantityController,
} from "../controller/cart.controller";

export default (router: express.Router) => {
  router.get("/cart", getCartController);
  router.post("/cart/:id", addCartController);
  router.put("/cart/:id", setCartQuantityController);
  router.delete("/cart/:id", removeCartController);
};
