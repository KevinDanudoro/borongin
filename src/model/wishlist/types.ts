import { Document, Model } from "mongoose";
import { Product } from "../product/types";
import { User } from "../user/types";

export interface IWishlist {
  user: string;
  product: string[];
}
export interface PopulatedWishlist {
  user: User;
  product: Product[];
}

export interface Wishlist extends Document, IWishlist {}

export type WishlistModelType = Model<Wishlist>;
