import mongoose from "mongoose";
import { Product, ProductModelType } from "./types";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: Array<String>,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  sold: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const ProductModel = mongoose.model<Product, ProductModelType>(
  "Product",
  productSchema
);
