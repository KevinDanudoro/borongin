import express from "express";
import {
  addWishlistController,
  removeWishlistController,
} from "../controller/wishlist.controller";

export default (router: express.Router) => {
  router.post("/wishlist", addWishlistController);
  router.delete("/wishlist", removeWishlistController);
};
