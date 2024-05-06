"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./auth.router"));
const product_router_1 = __importDefault(require("./product.router"));
const wishlist_router_1 = __importDefault(require("./wishlist.router"));
const cart_router_1 = __importDefault(require("./cart.router"));
const transaction_router_1 = __importDefault(require("./transaction.router"));
const user_router_1 = __importDefault(require("./user.router"));
const category_router_1 = __importDefault(require("./category.router"));
const router = express_1.default.Router();
exports.default = () => {
    (0, auth_router_1.default)(router);
    (0, wishlist_router_1.default)(router);
    (0, category_router_1.default)(router);
    (0, product_router_1.default)(router);
    (0, cart_router_1.default)(router);
    (0, transaction_router_1.default)(router);
    (0, user_router_1.default)(router);
    return router;
};
//# sourceMappingURL=index.js.map