import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
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
        type: Schema.ObjectId,
        ref: "Product",
        select: false,
      },
    ],
    cart: [
      {
        count: {
          type: Number,
          default: 0,
          select: false,
        },
        product: {
          type: Schema.ObjectId,
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

export const UserModel = mongoose.model("User", userSchema);
