"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_1 = require("../middleware");
const product_controller_1 = require("../controller/product.controller");
exports.default = (router) => {
    router.post("/product", middleware_1.upload.array("images"), product_controller_1.createProductController);
    router.get("/product", product_controller_1.getProductsController);
    router.get("/product/:id", product_controller_1.getProductByIdController);
    router.put("/product/:id", middleware_1.upload.array("images"), product_controller_1.updateProductByIdController);
    router.delete("/product/:id", product_controller_1.deleteProductByIdController);
};
//# sourceMappingURL=product.router.js.map