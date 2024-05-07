"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wishlist_controller_1 = require("../controller/wishlist.controller");
exports.default = (router) => {
    router.get("/wishlist", wishlist_controller_1.getWishlistController);
    router.post("/wishlist", wishlist_controller_1.addWishlistController);
    router.delete("/wishlist/:id", wishlist_controller_1.removeWishlistController);
};
//# sourceMappingURL=wishlist.router.js.map