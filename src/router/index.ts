import express from "express";
import auth from "./auth.router";
import product from "./product.router";

const router = express.Router();

export default (): express.Router => {
  auth(router);
  product(router);
  return router;
};
