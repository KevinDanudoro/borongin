import express from "express";
import { upload } from "../middleware";
import {
  deleteUserController,
  updateUserController,
} from "../controller/user.controller";

export default (router: express.Router) => {
  router.put("/user", upload.single("image"), updateUserController);
  router.delete("/user", deleteUserController);
};
