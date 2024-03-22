import express from "express";
import { signup } from "../controller/auth";

export default (router: express.Router) => {
  router.post("/auth/signup", signup);
};
