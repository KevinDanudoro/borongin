"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wishlist_controller_1 = require("../controller/wishlist.controller");
exports.default = (router) => {
    router.post("/wishlist", wishlist_controller_1.addWishlistController);
    router.delete("/wishlist", wishlist_controller_1.removeWishlistController);
};
//# sourceMappingURL=wishlist.router.js.map