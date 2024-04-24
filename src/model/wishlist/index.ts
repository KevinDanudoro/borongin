import mongoose from "mongoose";
import { Wishlist, WishlistModelType } from "./types";

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: [mongoose.Types.ObjectId],
    ref: "Product",
  },
});

export const WishlistModel = mongoose.model<Wishlist, WishlistModelType>(
  "Wishlist",
  wishlistSchema
);
