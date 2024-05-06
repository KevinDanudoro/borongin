import express from "express";
import {
  addWishlistController,
  getWishlistController,
  removeWishlistController,
} from "../controller/wishlist.controller";

export default (router: express.Router) => {
  router.get("/wishlist", getWishlistController);
  router.post("/wishlist", addWishlistController);
  router.delete("/wishlist", removeWishlistController);
};
