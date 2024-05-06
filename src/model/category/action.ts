import { CategoryModel } from ".";
import { ICategory } from "./types";

export const getCategories = () => CategoryModel.find();
export const getCategoryByName = (name: string) =>
  CategoryModel.findOne({ name });

export const createCategory = (newCategory: ICategory) =>
  CategoryModel.create(newCategory);

export const deleteCategoryById = (id: string) =>
  CategoryModel.findByIdAndDelete(id);

export const updateCategoryById = (id: string, newCategory: ICategory) =>
  CategoryModel.findByIdAndUpdate(id, newCategory);
