import mongoose from "mongoose";
import { User, UserModelType } from "./types";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    authentication: {
      password: {
        type: String,
        required: true,
        select: false,
      },
      salt: {
        type: String,
        select: false,
      },
    },
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        select: false,
      },
    ],
    cart: [
      {
        quantity: {
          type: Number,
          default: 0,
          select: false,
        },
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          select: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<User, UserModelType>(
  "User",
  userSchema
);
