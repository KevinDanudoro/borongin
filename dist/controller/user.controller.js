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
exports.deleteUserController = exports.updateUserController = void 0;
const action_1 = require("../model/user/action");
const user_1 = require("../schema/user");
const response_1 = require("../helpers/response");
const cloudinary_1 = require("../helpers/cloudinary");
const updateUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.session) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail)
        return (0, response_1.response)({ data: null, statusCode: 403, message: "User session not found" }, res);
    const user = user_1.updateUserSchema.safeParse(req.body);
    if (!user.success)
        return (0, response_1.response)({ data: user.error, statusCode: 400, message: "Bad user schema" }, res);
    try {
        const exisistingUser = yield (0, action_1.getUserByEmail)(userEmail);
        if (!exisistingUser)
            return (0, response_1.response)({ data: null, statusCode: 404, message: "User not found" }, res);
        const isDelSuccess = yield (0, cloudinary_1.deleteFromCloudinary)(exisistingUser.image ? [exisistingUser.image] : []);
        if (!isDelSuccess)
            throw new Error("Failed delete resource from cloud");
        const image = req.file;
        const uploadUrl = yield (0, cloudinary_1.uploadToCloudinary)([image], { folder: "user" });
        const dbUser = yield (0, action_1.updateUserByEmail)(userEmail, Object.assign(Object.assign({}, user.data), { image: uploadUrl[0] }));
        return (0, response_1.response)({ data: dbUser, message: "User successfuly updated", statusCode: 201 }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserController = updateUserController;
const deleteUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userEmail = (_b = req.session) === null || _b === void 0 ? void 0 : _b.email;
    if (!userEmail)
        return (0, response_1.response)({ data: null, statusCode: 403, message: "User session not found" }, res);
    try {
        const exisistingUser = yield (0, action_1.getUserByEmail)(userEmail);
        if (!exisistingUser)
            return (0, response_1.response)({ data: null, statusCode: 404, message: "User not found" }, res);
        if (exisistingUser.image) {
            const isDelSuccess = yield (0, cloudinary_1.deleteFromCloudinary)([exisistingUser.image]);
            if (!isDelSuccess)
                throw new Error("Failed delete product image from cloud");
        }
        const deletedUser = yield (0, action_1.deleteUserById)(exisistingUser === null || exisistingUser === void 0 ? void 0 : exisistingUser._id);
        if (!deletedUser)
            return (0, response_1.response)({ data: null, statusCode: 500, message: "Failed to delete user" }, res);
        return (0, response_1.response)({
            data: deletedUser,
            statusCode: 200,
            message: "Successfully delete user",
        }, res);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUserController = deleteUserController;
//# sourceMappingURL=user.controller.js.map