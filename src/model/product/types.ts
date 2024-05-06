import mongoose from "mongoose";

export interface Product extends mongoose.Document {
  name: string;
  desc: string;
  price: number;
  imageUrl: string[];
  rating: number;
  sold: number;
  category: string;
}

export type ProductModelType = mongoose.Model<Product>;
