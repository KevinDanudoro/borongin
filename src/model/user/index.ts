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
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<User, UserModelType>(
  "User",
  userSchema
);
