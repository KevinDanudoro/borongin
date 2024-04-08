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
exports.deleteProductByIdController = exports.updateProductByIdController = exports.getProductByIdController = exports.getProductsController = exports.createProductController = void 0;
const response_1 = require("../helpers/response");
const product_1 = require("../schema/product");
const action_1 = require("../model/product/action");
const cloudinary_1 = require("../helpers/cloudinary");
const createProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = product_1.createProductSchema.safeParse(req.body);
    if (!product.success)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Bad product schema" }, res);
    try {
        const productImage = req.files;
        const uploadUrl = yield (0, cloudinary_1.uploadToCloudinary)(productImage, {
            folder: "product",
        });
        const dbProduct = yield (0, action_1.createProduct)(Object.assign(Object.assign({}, product.data), { imageUrl: uploadUrl }));
        return (0, response_1.response)({
            data: dbProduct,
            statusCode: 201,
            message: "Successfully create new product",
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.createProductController = createProductController;
const getProductsController = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbProducts = yield (0, action_1.getProducts)();
        return (0, response_1.response)({
            data: dbProducts,
            statusCode: 200,
            message: "Successfully get all products",
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.getProductsController = getProductsController;
const getProductByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product ID is mandatory" }, res);
    try {
        const dbProduct = yield (0, action_1.getProductById)(id);
        return (0, response_1.response)({
            data: dbProduct,
            statusCode: 200,
            message: "Successfully get product with id " + id,
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.getProductByIdController = getProductByIdController;
// TODO: Handle penambahan / pengurangan gambar produk
//? Apakah sebaiknya cloudinary terhubung dengan nextjs?
const updateProductByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product ID is mandatory" }, res);
    const updatedProduct = product_1.updateProductSchema.safeParse(Object.assign({}, req.body));
    if (!updatedProduct.success)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Bad product schema" }, res);
    try {
        const productImage = req.files;
        const uploadUrl = yield (0, cloudinary_1.uploadToCloudinary)(productImage, {
            folder: "product",
        });
        const dbProduct = yield (0, action_1.updateProductById)(id, Object.assign(Object.assign({}, updatedProduct.data), { imageUrl: uploadUrl }));
        return (0, response_1.response)({
            data: dbProduct,
            statusCode: 201,
            message: "Successfully update product with id " + id,
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.updateProductByIdController = updateProductByIdController;
const deleteProductByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    if (!id)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product ID is mandatory" }, res);
    try {
        const dbProduct = yield (0, action_1.deleteProductById)(id);
        const isDelSuccess = yield (0, cloudinary_1.deleteFromCloudinary)((_a = dbProduct === null || dbProduct === void 0 ? void 0 : dbProduct.imageUrl) !== null && _a !== void 0 ? _a : []);
        if (!isDelSuccess)
            throw new Error("Failed delete product image from cloud");
        return (0, response_1.response)({
            data: dbProduct,
            statusCode: 200,
            message: "Successfully delete product with id " + id,
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProductByIdController = deleteProductByIdController;
//# sourceMappingURL=product.controller.js.map