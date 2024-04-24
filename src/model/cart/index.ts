import mongoose from "mongoose";
import { Cart, CartModelType } from "./types";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  cart: [
    {
      quantity: {
        type: Number,
        default: 1,
      },
      product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    },
  ],
});

export const CartModel = mongoose.model<Cart, CartModelType>(
  "Cart",
  cartSchema
);
