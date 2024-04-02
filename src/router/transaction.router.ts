import express from "express";
import { createTransactionController } from "../controller/transaction.controller";

export default (router: express.Router) => {
  router.post("/transaction", createTransactionController);
};
