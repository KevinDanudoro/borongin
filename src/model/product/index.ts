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
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
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
