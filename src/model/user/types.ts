import { Product } from "../product/types";
import mongoose from "mongoose";

interface UserCart {
  cart: mongoose.Types.Array<{
    quantity: number;
    product: mongoose.Types.ObjectId;
  }>;
}
export interface PopulatedUserCart {
  cart: mongoose.Types.Array<{
    quantity: number;
    product: Product;
  }>;
}

interface UserWishlist {
  wishlist: mongoose.Types.Array<mongoose.Types.ObjectId>;
}

export interface User extends mongoose.Document, UserCart, UserWishlist {
  username: string;
  email: string;
  image?: string;
  authentication: {
    password: string;
    salt: string;
  };
}

export type UserModelType = mongoose.Model<User>;
