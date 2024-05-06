"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_controller_1 = require("../controller/category.controller");
exports.default = (router) => {
    router.get("/category", category_controller_1.getCategoryController);
    router.post("/category", category_controller_1.createCategoryController);
    router.delete("/category/:id", category_controller_1.deleteCategoryController);
};
//# sourceMappingURL=category.router.js.map