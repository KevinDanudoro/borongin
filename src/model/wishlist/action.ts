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

// New true untuk mengembalikan dokumen pasca update
export const removeProductFromWishlist = (productId: string) =>
  WishlistModel.updateMany(
    {},
    { $pull: { product: productId } },
    { new: true }
  );
