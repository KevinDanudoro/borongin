import express from "express";
import auth from "./auth.router";
import product from "./product.router";
import wishlist from "./wishlist.router";
import cart from "./cart.router";
import transaction from "./transaction.router";
import user from "./user.router";

const router = express.Router();

export default (): express.Router => {
  auth(router);
  wishlist(router);
  product(router);
  cart(router);
  transaction(router);
  user(router);

  return router;
};
