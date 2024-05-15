import mongoose from "mongoose";
import { Product } from "../product/types";

export interface User extends mongoose.Document {
  username: string;
  email: string;
  image?: string;
  authentication: {
    password: string;
    salt: string;
  };
}

export type UserModelType = mongoose.Model<User>;
