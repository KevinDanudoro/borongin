"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProductFromWishlist = exports.deleteWishlistByUserId = exports.updateWishlistByUserId = exports.createWishlistByUserId = exports.getWishlistByUserId = void 0;
const _1 = require(".");
const getWishlistByUserId = (id) => _1.WishlistModel.findOne({ user: id });
exports.getWishlistByUserId = getWishlistByUserId;
const createWishlistByUserId = (wishlist) => _1.WishlistModel.create(wishlist);
exports.createWishlistByUserId = createWishlistByUserId;
const updateWishlistByUserId = (userId, wishlist) => _1.WishlistModel.findOneAndUpdate({ user: userId }, wishlist);
exports.updateWishlistByUserId = updateWishlistByUserId;
const deleteWishlistByUserId = (userId) => _1.WishlistModel.findOneAndDelete({ user: userId });
exports.deleteWishlistByUserId = deleteWishlistByUserId;
// New true untuk mengembalikan dokumen pasca update
const removeProductFromWishlist = (productId) => _1.WishlistModel.updateMany({}, { $pull: { product: productId } }, { new: true });
exports.removeProductFromWishlist = removeProductFromWishlist;
//# sourceMappingURL=action.js.map