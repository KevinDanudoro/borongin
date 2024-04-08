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
exports.removeWishlistController = exports.addWishlistController = void 0;
const response_1 = require("../helpers/response");
const action_1 = require("../model/user/action");
const addWishlistController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.session) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail)
        return (0, response_1.response)({ data: null, statusCode: 404, message: "User session not found" }, res);
    const { productId } = req.body;
    if (!productId)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product ID is mandatory" }, res);
    try {
        const user = yield (0, action_1.getUserByEmail)(userEmail).select({ wishlist: 1 });
        if (!user)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "User not found",
            }, res);
        const isInclude = user.wishlist.includes(productId);
        if (isInclude)
            return (0, response_1.response)({
                data: null,
                statusCode: 400,
                message: "Product already in wishlist",
            }, res);
        user.wishlist.push(productId);
        const dbUser = yield (0, action_1.updateUserByEmail)(userEmail, user);
        if (!dbUser)
            throw new Error(`Failed add wishlists to user with email ${userEmail}`);
        return (0, response_1.response)({
            data: dbUser,
            statusCode: 200,
            message: "Successfully add wishlists to user with email " + userEmail,
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.addWishlistController = addWishlistController;
const removeWishlistController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userEmail = (_b = req.session) === null || _b === void 0 ? void 0 : _b.email;
    if (!userEmail)
        return (0, response_1.response)({ data: null, statusCode: 404, message: "User session not found" }, res);
    const { productId } = req.body;
    if (!productId)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Product ID is mandatory" }, res);
    try {
        const user = yield (0, action_1.getUserByEmail)(userEmail).select({ wishlist: 1 });
        if (!user)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "User not found",
            }, res);
        const wishlistIndex = user.wishlist.findIndex((u) => u._id.toString() === productId);
        if (wishlistIndex < 0)
            return (0, response_1.response)({
                data: null,
                statusCode: 404,
                message: "Product not found in wishlist",
            }, res);
        user.wishlist.splice(wishlistIndex, 1);
        const dbUser = yield (0, action_1.updateUserByEmail)(userEmail, user);
        if (!dbUser)
            throw new Error(`Failed remove wishlists from user with email ${userEmail}`);
        return (0, response_1.response)({
            data: dbUser,
            statusCode: 200,
            message: "Successfully remove wishlists from user with email " + userEmail,
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.removeWishlistController = removeWishlistController;
//# sourceMappingURL=wishlist.controller.js.map