import express from "express";
import { signin, signup } from "../controller/auth.controller";

export default (router: express.Router) => {
  router.post("/auth/signup", signup);
  router.post("/auth/signin", signin);
};
