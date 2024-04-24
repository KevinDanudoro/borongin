import { WishlistModel } from ".";
import { IWishlist } from "./types";

export const getWishlistByUserId = (id: string) =>
  WishlistModel.findOne({ user: id });
export const createWishlistByUserId = (wishlist: IWishlist) =>
  WishlistModel.create(wishlist);
export const updateWishlistByUserId = (userId: string, wishlist: IWishlist) =>
  WishlistModel.findOneAndUpdate({ user: userId }, wishlist);
export const deleteWishlistByUserId = (userId: string) =>
  WishlistModel.findOneAndDelete({ user: userId });
