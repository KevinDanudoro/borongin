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
const action_2 = require("../model/wishlist/action");
const action_3 = require("../model/user/action");
const action_4 = require("../model/cart/action");
const action_5 = require("../model/category/action");
const createProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const product = product_1.createProductSchema.safeParse(req.body);
    if (!product.success)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Bad product schema" }, res);
    try {
        const isValidCategory = !!(yield (0, action_5.getCategoryByName)(product.data.category));
        if (!isValidCategory)
            return (0, response_1.response)({ data: null, statusCode: 404, message: "Product category not found" }, res);
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
const getProductsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.session) === null || _a === void 0 ? void 0 : _a.email;
    try {
        const dbProducts = yield (0, action_1.getProducts)();
        if (userEmail) {
            const user = yield (0, action_3.getUserByEmail)(userEmail);
            if (!user)
                return (0, response_1.response)({
                    data: dbProducts,
                    statusCode: 200,
                    message: "Successfully get all products",
                }, res);
            const wishlist = yield (0, action_2.getWishlistByUserId)(user._id);
            const carts = yield (0, action_4.getCartByUserId)(user._id);
            const labeledProducts = dbProducts.map((product) => {
                if (!wishlist || !carts)
                    return product;
                const cartProductIds = carts.cart.map((c) => c.product);
                const labeledByWishlist = wishlist.product.includes(product._id)
                    ? Object.assign(Object.assign({}, product.toObject()), { isWishlist: true }) : Object.assign(Object.assign({}, product.toObject()), { isWishlist: false });
                const labeledByCart = cartProductIds.includes(labeledByWishlist._id)
                    ? Object.assign(Object.assign({}, labeledByWishlist), { isCart: true }) : Object.assign(Object.assign({}, labeledByWishlist), { isCart: false });
                return labeledByCart;
            });
            return (0, response_1.response)({
                data: labeledProducts,
                statusCode: 200,
                message: "Successfully get all products",
            }, res);
        }
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
const updateProductByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id } = req.params;
    if (!id)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product ID is mandatory" }, res);
    const updatedProduct = product_1.updateProductSchema.safeParse(Object.assign({}, req.body));
    if (!updatedProduct.success)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Bad product schema" }, res);
    try {
        const existingProduct = yield (0, action_1.getProductById)(id);
        if (!existingProduct)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "Product not found",
            }, res);
        const isDelSuccess = yield (0, cloudinary_1.deleteFromCloudinary)((_b = updatedProduct.data.deleteImages) !== null && _b !== void 0 ? _b : []);
        if (!isDelSuccess)
            throw new Error("Failed to delete resource from cloud");
        const imageUrlAfterDeletion = existingProduct.imageUrl.filter((img) => { var _a; return !((_a = updatedProduct.data.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(img)); });
        const productImage = req.files;
        const uploadUrl = yield (0, cloudinary_1.uploadToCloudinary)(productImage, {
            folder: "product",
        });
        const dbProduct = yield (0, action_1.updateProductById)(id, Object.assign(Object.assign({}, updatedProduct.data), { imageUrl: [...uploadUrl, ...imageUrlAfterDeletion] }));
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
    var _c;
    const { id } = req.params;
    if (!id)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product ID is mandatory" }, res);
    try {
        // Hapus produk
        const dbProduct = yield (0, action_1.deleteProductById)(id);
        // Hapus wishlist dan cart terkait
        const dbWishlist = yield (0, action_2.removeProductFromWishlist)(id);
        const dbCart = yield (0, action_4.removeProductFromCart)(id);
        // Hapus assets dari cloudinary
        const isDelSuccess = yield (0, cloudinary_1.deleteFromCloudinary)((_c = dbProduct === null || dbProduct === void 0 ? void 0 : dbProduct.imageUrl) !== null && _c !== void 0 ? _c : []);
        if (!isDelSuccess)
            throw new Error("Failed to delete resource from cloud");
        return (0, response_1.response)({
            data: { product: dbProduct, wishlist: dbWishlist, cart: dbCart },
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