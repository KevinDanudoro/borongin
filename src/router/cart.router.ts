import express from "express";
import {
  addCartController,
  removeCartController,
} from "../controller/cart.controller";

export default (router: express.Router) => {
  router.post("/cart", addCartController);
  router.delete("/cart", removeCartController);
};
