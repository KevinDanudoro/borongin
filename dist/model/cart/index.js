"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
    },
    cart: [
        {
            quantity: {
                type: Number,
                default: 1,
            },
            product: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "Product",
            },
        },
    ],
});
exports.CartModel = mongoose_1.default.model("Cart", cartSchema);
//# sourceMappingURL=index.js.map