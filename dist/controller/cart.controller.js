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
exports.setCartQuantityController = exports.removeCartController = exports.addCartController = exports.getCartController = void 0;
const response_1 = require("../helpers/response");
const action_1 = require("../model/user/action");
const action_2 = require("../model/product/action");
const action_3 = require("../model/cart/action");
const getCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
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
        // Dapatkan cart dari DB
        const cart = (_c = (_b = (yield (0, action_3.getCartByUserId)(user._id).populate("cart.product"))) === null || _b === void 0 ? void 0 : _b.cart) !== null && _c !== void 0 ? _c : [];
        return (0, response_1.response)({ data: cart, message: "Success get user cart", statusCode: 200 }, res);
    }
    catch (err) {
        next(err);
    }
});
exports.getCartController = getCartController;
const addCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userEmail = (_d = req.session) === null || _d === void 0 ? void 0 : _d.email;
    if (!userEmail)
        return (0, response_1.response)({ data: null, statusCode: 403, message: "User session not found" }, res);
    const { id: productId } = req.params;
    if (!productId)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product ID is mandatory" }, res);
    try {
        const user = yield (0, action_1.getUserByEmail)(userEmail);
        // Pastikan bahwa user benar ada
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
        const userCart = yield (0, action_3.getCartByUserId)(user._id);
        // Jika user cart masih kosong maka buat baru
        if (!userCart) {
            const createdCart = yield (0, action_3.createCartByUserId)({
                user: user._id,
                cart: [{ product: productId, quantity: 1 }],
            });
            return (0, response_1.response)({
                data: createdCart,
                statusCode: 200,
                message: "Success adding product to user cart",
            }, res);
        }
        // Cari produkId yang sama dengan cara menentukan index array-nya
        const cartIndex = userCart.cart.findIndex((c) => c.product.toString() === productId);
        // Jika index ditemukan (> -1), kembalikan bahwa produk sudah terdapat pada cart
        if (cartIndex > -1)
            return (0, response_1.response)({
                data: userCart,
                statusCode: 400,
                message: "Product already in cart",
            }, res);
        // Jika produk tidak ditemukan pada cart, maka ...
        // tambahkan produk secara langsung ke cart dan set quantity ke 1
        userCart.cart.push({ product: productId, quantity: 1 });
        const updatedCart = yield (0, action_3.updateCartByUserId)(user._id, userCart);
        return (0, response_1.response)({
            data: updatedCart,
            statusCode: 200,
            message: "Success adding product to user cart",
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.addCartController = addCartController;
const removeCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const userEmail = (_e = req.session) === null || _e === void 0 ? void 0 : _e.email;
    if (!userEmail)
        return (0, response_1.response)({ data: null, statusCode: 403, message: "User session not found" }, res);
    const { id: productId } = req.params;
    if (!productId)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product ID is mandatory" }, res);
    try {
        const user = yield (0, action_1.getUserByEmail)(userEmail);
        // Pastikan bahwa user benar ada
        if (!user)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "User not found",
            }, res);
        const product = yield (0, action_2.getProductById)(productId);
        // Pastikan bahwa product ID valid dan ada
        if (!product)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "Product not found",
            }, res);
        const userCart = yield (0, action_3.getCartByUserId)(user._id);
        // Jika user cart kosong maka batalkan request user
        if (!userCart) {
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "User cart is empty",
            }, res);
        }
        // Mencari index dari produk yang ingin dihapus
        const cartIndex = userCart.cart.findIndex((u) => u.product.toString() === productId);
        // Jika produk tidak ditemukan pada cart maka berikan response berikut
        if (cartIndex < 0)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "Product is not in the cart",
            }, res);
        // Jika produk ditemukan pada index tertentu maka hapus produk pada cart
        userCart.cart.splice(cartIndex, 1);
        // Simpan hasil perubahan cart ke DB
        const updatedCart = yield (0, action_3.updateCartByUserId)(user._id, userCart);
        return (0, response_1.response)({
            data: updatedCart,
            statusCode: 200,
            message: "Success decrease product quantity from cart",
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.removeCartController = removeCartController;
const setCartQuantityController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const userEmail = (_f = req.session) === null || _f === void 0 ? void 0 : _f.email;
    const { id: productId } = req.params;
    const { quantity } = req.body;
    if (!userEmail)
        return (0, response_1.response)({ data: null, statusCode: 403, message: "User session not found" }, res);
    if (!quantity || quantity < 0)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Quantity must greater than 0" }, res);
    if (!productId)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product id is mandatory" }, res);
    try {
        const user = yield (0, action_1.getUserByEmail)(userEmail);
        // Pastikan bahwa user benar ada
        if (!user)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "User not found",
            }, res);
        const product = yield (0, action_2.getProductById)(productId);
        // Pastikan bahwa product ID valid dan ada
        if (!product)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "Product not found",
            }, res);
        const userCart = yield (0, action_3.getCartByUserId)(user._id);
        // Jika user cart kosong maka batalkan request user
        if (!userCart) {
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "User cart is empty",
            }, res);
        }
        const productCartIndex = userCart.cart.findIndex((cart) => cart.product.includes(productId));
        if (productCartIndex < 0)
            return (0, response_1.response)({ data: null, statusCode: 404, message: "Product not found in cart" }, res);
        userCart.cart[productCartIndex] = {
            quantity,
            product: userCart.cart[productCartIndex].product,
        };
    }
    catch (err) {
        next(err);
    }
});
exports.setCartQuantityController = setCartQuantityController;
//# sourceMappingURL=cart.controller.js.map