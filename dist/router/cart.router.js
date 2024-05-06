"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cart_controller_1 = require("../controller/cart.controller");
exports.default = (router) => {
    router.get("/cart", cart_controller_1.getCartController);
    router.post("/cart", cart_controller_1.addCartController);
    router.delete("/cart", cart_controller_1.removeCartController);
};
//# sourceMappingURL=cart.router.js.map