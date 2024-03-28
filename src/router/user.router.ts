import express from "express";
import { addWishlistController } from "../controller/wishlist.controller";

export default (router: express.Router) => {
  router.put("/wishlist", addWishlistController);
};
