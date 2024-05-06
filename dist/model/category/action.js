"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryById = exports.deleteCategoryById = exports.createCategory = exports.getCategoryByName = exports.getCategories = void 0;
const _1 = require(".");
const getCategories = () => _1.CategoryModel.find();
exports.getCategories = getCategories;
const getCategoryByName = (name) => _1.CategoryModel.findOne({ name });
exports.getCategoryByName = getCategoryByName;
const createCategory = (newCategory) => _1.CategoryModel.create(newCategory);
exports.createCategory = createCategory;
const deleteCategoryById = (id) => _1.CategoryModel.findByIdAndDelete(id);
exports.deleteCategoryById = deleteCategoryById;
const updateCategoryById = (id, newCategory) => _1.CategoryModel.findByIdAndUpdate(id, newCategory);
exports.updateCategoryById = updateCategoryById;
//# sourceMappingURL=action.js.map