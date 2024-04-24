"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wishlistSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
    },
    product: {
        type: [mongoose_1.default.Types.ObjectId],
        ref: "Product",
    },
});
exports.WishlistModel = mongoose_1.default.model("Wishlist", wishlistSchema);
//# sourceMappingURL=index.js.map