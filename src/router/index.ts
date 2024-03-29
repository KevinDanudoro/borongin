import express from "express";
import auth from "./auth.router";
import product from "./product.router";
import user from "./wishlist.router";

const router = express.Router();

export default (): express.Router => {
  auth(router);
  user(router);
  product(router);

  return router;
};
