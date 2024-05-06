import { ProductModel } from ".";

export const getProducts = () => ProductModel.find();
export const getProductByName = (name: string) =>
  ProductModel.findOne({ name });
export const getProductById = (id: string) => ProductModel.findById(id);

export const createProduct = (newProduct: Record<string, any>) =>
  ProductModel.create(newProduct);

export const deleteProductById = (id: string) =>
  ProductModel.findByIdAndDelete(id);
export const deleteProductByCategory = (category: string) =>
  ProductModel.deleteMany({ category });

export const updateProductById = (
  id: string,
  newProduct: Record<string, any>
) => ProductModel.findByIdAndUpdate(id, newProduct);
