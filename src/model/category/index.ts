import mongoose from "mongoose";
import { Category, CategoryModelType } from "./types";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const CategoryModel = mongoose.model<Category, CategoryModelType>(
  "Category",
  categorySchema
);
