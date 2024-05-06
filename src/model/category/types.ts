import mongoose from "mongoose";

export interface ICategory {
  name: string;
}
export interface Category extends mongoose.Document, ICategory {}

export type CategoryModelType = mongoose.Model<Category>;
