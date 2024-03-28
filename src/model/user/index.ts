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
        productId: Schema.ObjectId,
        name: String,
        desc: String,
        price: Number,
        rating: Number,
        imageUrl: String,
        sold: Number,
      },
    ],
    cart: [
      {
        productId: Schema.ObjectId,
        name: String,
        desc: String,
        price: Number,
        rating: Number,
        imageUrl: String,
        sold: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", userSchema);
