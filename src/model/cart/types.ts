import { Document, Model } from "mongoose";
import { Product } from "../product/types";
import { User } from "../user/types";

export interface ICart {
  user: string;
  cart: {
    product: string;
    quantity: number;
  }[];
}
export interface PopulatedCart {
  user: User;
  cart: {
    product: Product;
    quantity: number;
  }[];
}

export interface Cart extends Document, ICart {}

export type CartModelType = Model<Cart>;
