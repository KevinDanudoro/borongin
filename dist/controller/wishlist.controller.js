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
exports.removeWishlistController = exports.addWishlistController = exports.getWishlistController = void 0;
const response_1 = require("../helpers/response");
const action_1 = require("../model/user/action");
const action_2 = require("../model/product/action");
const action_3 = require("../model/wishlist/action");
const action_4 = require("../model/cart/action");
const getWishlistController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.session) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail)
        return (0, response_1.response)({ data: null, statusCode: 404, message: "User session not found" }, res);
    try {
        const user = yield (0, action_1.getUserByEmail)(userEmail);
        // Pastikan user ada pada DB
        if (!user)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "User not found",
            }, res);
        // Dapatkan wishlist dari DB
        const wishlist = yield (0, action_3.getWishlistByUserId)(user._id).populate("product");
        const carts = yield (0, action_4.getCartByUserId)(user._id);
        const labeledProducts = wishlist
            ? wishlist.product.map((product) => {
                if (!wishlist || !carts)
                    return product;
                const cartProductIds = carts.cart.map((c) => c.product.toString());
                const labeledByCart = cartProductIds.includes(product._id.toString())
                    ? Object.assign(Object.assign({}, product.toObject()), { isCart: true, isWishlist: true }) : Object.assign(Object.assign({}, product.toObject()), { isCart: false, isWishlist: true });
                return labeledByCart;
            })
            : [];
        return (0, response_1.response)({
            data: labeledProducts !== null && labeledProducts !== void 0 ? labeledProducts : wishlist,
            statusCode: 200,
            message: "Successfully get all products",
        }, res);
    }
    catch (err) {
        next(err);
    }
});
exports.getWishlistController = getWishlistController;
const addWishlistController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userEmail = (_b = req.session) === null || _b === void 0 ? void 0 : _b.email;
    if (!userEmail)
        return (0, response_1.response)({ data: null, statusCode: 404, message: "User session not found" }, res);
    const { id: productId } = req.params;
    if (!productId)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product ID is mandatory" }, res);
    try {
        const user = yield (0, action_1.getUserByEmail)(userEmail);
        // Pastikan user ada pada DB
        if (!user)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "User not found",
            }, res);
        const product = yield (0, action_2.getProductById)(productId);
        //Pastikan productId valid dan ada
        if (!product)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "Product not found",
            }, res);
        const userWishlist = yield (0, action_3.getWishlistByUserId)(user._id);
        // Jika user wishlist masih kosong maka buat baru
        if (!userWishlist) {
            const createdWishlist = yield (0, action_3.createWishlistByUserId)({
                user: user._id,
                product: [productId],
            });
            return (0, response_1.response)({
                data: createdWishlist,
                statusCode: 200,
                message: "Success adding product to user cart",
            }, res);
        }
        const isInclude = userWishlist.product.includes(productId);
        // Jika produk ditemukan pada wishlist maka jangan tambah produk ke wishlist
        if (isInclude)
            return (0, response_1.response)({
                data: null,
                statusCode: 400,
                message: "Product already in wishlist",
            }, res);
        // Jika produk tidak terdapat pada wishlist maka tambahkan ke wishlist
        userWishlist.product.push(productId);
        const updatedWishlist = yield (0, action_3.updateWishlistByUserId)(user._id, userWishlist);
        return (0, response_1.response)({
            data: updatedWishlist,
            statusCode: 200,
            message: "Successfully add product to user wishlist",
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.addWishlistController = addWishlistController;
const removeWishlistController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userEmail = (_c = req.session) === null || _c === void 0 ? void 0 : _c.email;
    if (!userEmail)
        return (0, response_1.response)({ data: null, statusCode: 404, message: "User session not found" }, res);
    const { id: productId } = req.params;
    if (!productId)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product ID is mandatory" }, res);
    try {
        const user = yield (0, action_1.getUserByEmail)(userEmail);
        // Pastikan user ada pada DB
        if (!user)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "User not found",
            }, res);
        const product = yield (0, action_2.getProductById)(productId);
        //Pastikan productId valid dan ada
        if (!product)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "Product not found",
            }, res);
        const userWishlist = yield (0, action_3.getWishlistByUserId)(user._id);
        // Jika user wishlist kosong maka tolak request user
        if (!userWishlist) {
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "User wishlist is empty",
            }, res);
        }
        // Jika user wishlist ada maka cari index dari produk yang ingin dihapus
        const wishlistIndex = userWishlist.product.findIndex((product) => product.toString() === productId);
        // Jika index dari produk yang ingin dihapus ditemukan maka ...
        if (wishlistIndex > -1) {
            // Hapus produk dari array / list, lalu update DB
            userWishlist.product.splice(wishlistIndex, 1);
            const updatedWishlist = yield (0, action_3.updateWishlistByUserId)(user._id, userWishlist);
            return (0, response_1.response)({
                data: updatedWishlist,
                statusCode: 200,
                message: "Successfully remove product from user wishlist",
            }, res);
        }
        // Jika index dari produk tidak ditemukan pada wishlist maka hentikan request user
        return (0, response_1.response)({
            data: null,
            statusCode: 404,
            message: "Product not found in wishlist",
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.removeWishlistController = removeWishlistController;
//# sourceMappingURL=wishlist.controller.js.map