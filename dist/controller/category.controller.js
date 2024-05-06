"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryController = exports.getCategoryController = exports.createCategoryController = void 0;
const category_1 = require("../schema/category");
const response_1 = require("../helpers/response");
const action_1 = require("../model/category/action");
const action_2 = require("../model/product/action");
const createCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = category_1.createCategorySchema.safeParse(req.body);
    if (!category.success)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Bad category schema" }, res);
    try {
        const dbCategories = yield (0, action_1.createCategory)(category.data);
        return (0, response_1.response)({
            data: dbCategories,
            message: "Success create new category",
            statusCode: 201,
        }, res);
    }
    catch (error) {
        console.log("error", error);
        next(error);
    }
});
exports.createCategoryController = createCategoryController;
const getCategoryController = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbCategories = yield (0, action_1.getCategories)();
        return (0, response_1.response)({
            data: dbCategories,
            message: "Success get categories",
            statusCode: 200,
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.getCategoryController = getCategoryController;
const deleteCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Category ID is mandatory" }, res);
    try {
        const dbCategory = yield (0, action_1.deleteCategoryById)(id);
        if (!dbCategory)
            throw new Error("Failed delete category");
        const dbProduct = yield (0, action_2.deleteProductByCategory)(dbCategory.name);
        if (!dbProduct)
            throw new Error("Failed to delete product that coresponden to category");
        return (0, response_1.response)({
            data: { category: dbCategory, product: dbProduct },
            statusCode: 200,
            message: `Successfully delete ${dbCategory.name} category`,
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCategoryController = deleteCategoryController;
//# sourceMappingURL=category.controller.js.map