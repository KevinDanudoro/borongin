"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createProductSchema = zod_1.default.object({
    name: zod_1.default.string().min(1),
    desc: zod_1.default.string().min(1),
    price: zod_1.default.coerce.number().min(0),
    imageUrl: zod_1.default.array(zod_1.default.string()).nullish(),
});
exports.updateProductSchema = zod_1.default.object({
    name: zod_1.default.string().min(1),
    desc: zod_1.default.string().min(1),
    price: zod_1.default.coerce.number().min(0),
    imageUrl: zod_1.default.array(zod_1.default.string()).nullish(),
});
//# sourceMappingURL=product.js.map