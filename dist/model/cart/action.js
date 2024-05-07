"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeProductFromCart = exports.deleteCartByUserId = exports.updateCartByUserId = exports.createCartByUserId = exports.getCartByUserId = void 0;
const _1 = require(".");
const getCartByUserId = (id) => _1.CartModel.findOne({ user: id });
exports.getCartByUserId = getCartByUserId;
const createCartByUserId = (cart) => _1.CartModel.create(cart);
exports.createCartByUserId = createCartByUserId;
const updateCartByUserId = (userId, cart) => _1.CartModel.findOneAndUpdate({ user: userId }, cart);
exports.updateCartByUserId = updateCartByUserId;
const deleteCartByUserId = (userId) => _1.CartModel.findOneAndDelete({ user: userId });
exports.deleteCartByUserId = deleteCartByUserId;
const removeProductFromCart = (productId) => _1.CartModel.updateMany({}, { $pull: { cart: { product: productId } } }, { new: true });
exports.removeProductFromCart = removeProductFromCart;
//# sourceMappingURL=action.js.map