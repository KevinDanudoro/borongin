import mongoose from "mongoose";

export interface User extends mongoose.Document {
  username: string;
  email: string;
  authentication: {
    password: string;
    salt: string;
  };
  wishlist: mongoose.Types.Array<mongoose.Types.ObjectId>;
  cart: mongoose.Types.Array<{
    quantity: number;
    product: mongoose.Types.ObjectId;
  }>;
}

export type UserModelType = mongoose.Model<User>;
