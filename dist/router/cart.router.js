"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cart_controller_1 = require("../controller/cart.controller");
exports.default = (router) => {
    router.get("/cart", cart_controller_1.getCartController);
    router.post("/cart/:id", cart_controller_1.addCartController);
    router.put("/cart/:id", cart_controller_1.setCartQuantityController);
    router.delete("/cart/:id", cart_controller_1.removeCartController);
};
//# sourceMappingURL=cart.router.js.map