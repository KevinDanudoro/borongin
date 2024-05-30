import express from "express";
import {
  createCartTransactionController,
  createProductTransactionController,
} from "../controller/transaction.controller";

export default (router: express.Router) => {
  router.post("/transaction/product/:id", createProductTransactionController);
  router.post("/transaction/cart", createCartTransactionController);
};
