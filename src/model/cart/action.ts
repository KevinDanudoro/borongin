import { CartModel } from ".";
import { ICart } from "./types";

export const getCartByUserId = (id: string) => CartModel.findOne({ user: id });
export const createCartByUserId = (cart: ICart) => CartModel.create(cart);
export const updateCartByUserId = (userId: string, cart: ICart) =>
  CartModel.findOneAndUpdate({ user: userId }, cart);
export const deleteCartByUserId = (userId: string) =>
  CartModel.findOneAndDelete({ user: userId });

export const removeProductFromCart = (productId: string) =>
  CartModel.updateMany(
    {},
    { $pull: { cart: { product: productId } } },
    { new: true }
  );
