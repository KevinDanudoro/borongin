"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductById = exports.deleteProductByCategory = exports.deleteProductById = exports.createProduct = exports.getProductById = exports.getProductByName = exports.getProducts = void 0;
const _1 = require(".");
const getProducts = () => _1.ProductModel.find();
exports.getProducts = getProducts;
const getProductByName = (name) => _1.ProductModel.findOne({ name });
exports.getProductByName = getProductByName;
const getProductById = (id) => _1.ProductModel.findById(id);
exports.getProductById = getProductById;
const createProduct = (newProduct) => _1.ProductModel.create(newProduct);
exports.createProduct = createProduct;
const deleteProductById = (id) => _1.ProductModel.findByIdAndDelete(id);
exports.deleteProductById = deleteProductById;
const deleteProductByCategory = (category) => _1.ProductModel.deleteMany({ category });
exports.deleteProductByCategory = deleteProductByCategory;
const updateProductById = (id, newProduct) => _1.ProductModel.findByIdAndUpdate(id, newProduct);
exports.updateProductById = updateProductById;
//# sourceMappingURL=action.js.map