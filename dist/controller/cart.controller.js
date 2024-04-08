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
exports.removeCartController = exports.addCartController = void 0;
const response_1 = require("../helpers/response");
const action_1 = require("../model/user/action");
const addCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const userEmail = (_a = req.session) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail)
        return (0, response_1.response)({ data: null, statusCode: 403, message: "User session not found" }, res);
    const { productId } = req.body;
    if (!productId)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product ID is mandatory" }, res);
    try {
        const user = yield (0, action_1.getUserByEmail)(userEmail).select({
            "cart.quantity": 1,
            "cart.product": 1,
        });
        if (!user)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "User not found",
            }, res);
        const cartIndex = user.cart.findIndex((c) => { var _a; return ((_a = c.product) === null || _a === void 0 ? void 0 : _a._id.toString()) === productId; });
        if (cartIndex >= 0) {
            const quantity = (_c = (_b = user.cart.at(cartIndex)) === null || _b === void 0 ? void 0 : _b.quantity) !== null && _c !== void 0 ? _c : 1;
            user.cart.set(cartIndex, {
                quantity: quantity + 1,
                product: productId,
            });
        }
        else {
            user.cart.push({ quantity: 1, product: productId });
        }
        const dbUser = yield (0, action_1.updateUserByEmail)(userEmail, user);
        if (!dbUser)
            throw new Error("Failed adding product to user cart");
        return (0, response_1.response)({
            data: dbUser,
            statusCode: 200,
            message: "Successfully adding product to user cart",
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.addCartController = addCartController;
const removeCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userEmail = (_d = req.session) === null || _d === void 0 ? void 0 : _d.email;
    if (!userEmail)
        return (0, response_1.response)({ data: null, statusCode: 403, message: "User session not found" }, res);
    const { productId } = req.body;
    if (!productId)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product ID is mandatory" }, res);
    try {
        const user = yield (0, action_1.getUserByEmail)(userEmail).select({
            "cart.product": 1,
            "cart.quantity": 1,
        });
        if (!user)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "User not found",
            }, res);
        const cartIndex = user.cart.findIndex((u) => u.product._id.toString() === productId);
        const quantity = user.cart[cartIndex].quantity;
        if (cartIndex >= 0 && quantity > 1) {
            user.cart.set(cartIndex, {
                quantity: quantity - 1,
                product: productId,
            });
        }
        else if (cartIndex >= 0 && quantity === 1) {
            user.cart.splice(cartIndex, 1);
        }
        else {
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "Product not found in user cart",
            }, res);
        }
        const dbUser = yield (0, action_1.updateUserByEmail)(userEmail, user);
        if (!dbUser)
            throw new Error(`Failed remove product from user cart with email ${userEmail}`);
        return (0, response_1.response)({
            data: dbUser,
            statusCode: 200,
            message: "Successfully remove product from user cart with email " + userEmail,
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.removeCartController = removeCartController;
//# sourceMappingURL=cart.controller.js.map