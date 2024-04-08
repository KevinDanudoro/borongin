"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.jwtUserSchema = exports.signInUserSchema = exports.signUpUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signUpUserSchema = zod_1.default.object({
    username: zod_1.default.string().min(1),
    email: zod_1.default.string().email().min(1),
    password: zod_1.default.string().min(8),
});
exports.signInUserSchema = zod_1.default.object({
    email: zod_1.default.string().email().min(1),
    password: zod_1.default.string().min(8),
});
exports.jwtUserSchema = zod_1.default.object({
    id: zod_1.default.string().min(1),
    username: zod_1.default.string().min(1),
    email: zod_1.default.string().email().min(1),
    iat: zod_1.default.number(),
    exp: zod_1.default.number(),
});
exports.updateUserSchema = zod_1.default.object({
    username: zod_1.default.string().min(1),
});
//# sourceMappingURL=user.js.map