import express from "express";
import { response } from "../helpers/response";
import { getUserByEmail } from "../model/user/action";
import { getProductById } from "../model/product/action";
import {
  createWishlistByUserId,
  getWishlistByUserId,
  updateWishlistByUserId,
} from "../model/wishlist/action";
import { getCartByUserId } from "../model/cart/action";
import { PopulatedWishlist } from "../model/wishlist/types";

export const getWishlistController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userEmail = req.session?.email;
  if (!userEmail)
    return response(
      { data: null, statusCode: 404, message: "User session not found" },
      res
    );

  try {
    const user = await getUserByEmail(userEmail);
    // Pastikan user ada pada DB
    if (!user)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "User not found",
        },
        res
      );

    // Dapatkan wishlist dari DB
    const wishlist = await getWishlistByUserId(
      user._id
    ).populate<PopulatedWishlist>("product");
    const carts = await getCartByUserId(user._id);

    const labeledProducts = wishlist
      ? wishlist.product.map((product) => {
          if (!wishlist || !carts) return product as Record<string, any>;

          const cartProductIds = carts.cart.map((c) => c.product.toString());
          const labeledByCart = cartProductIds.includes(product._id.toString())
            ? { ...product.toObject(), isCart: true, isWishlist: true }
            : { ...product.toObject(), isCart: false, isWishlist: true };

          return labeledByCart as Record<string, any>;
        })
      : [];

    return response(
      {
        data: labeledProducts ?? wishlist,
        statusCode: 200,
        message: "Successfully get all products",
      },
      res
    );
  } catch (err) {
    next(err);
  }
};

export const addWishlistController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userEmail = req.session?.email;
  if (!userEmail)
    return response(
      { data: null, statusCode: 404, message: "User session not found" },
      res
    );

  const { id: productId } = req.params;
  if (!productId)
    return response(
      { data: null, statusCode: 400, message: "Product ID is mandatory" },
      res
    );

  try {
    const user = await getUserByEmail(userEmail);
    // Pastikan user ada pada DB
    if (!user)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "User not found",
        },
        res
      );

    const product = await getProductById(productId);
    //Pastikan productId valid dan ada
    if (!product)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "Product not found",
        },
        res
      );

    const userWishlist = await getWishlistByUserId(user._id);

    // Jika user wishlist masih kosong maka buat baru
    if (!userWishlist) {
      const createdWishlist = await createWishlistByUserId({
        user: user._id,
        product: [productId],
      });
      return response(
        {
          data: createdWishlist,
          statusCode: 200,
          message: "Success adding product to user cart",
        },
        res
      );
    }

    const isInclude = userWishlist.product.includes(productId);

    // Jika produk ditemukan pada wishlist maka jangan tambah produk ke wishlist
    if (isInclude)
      return response(
        {
          data: null,
          statusCode: 400,
          message: "Product already in wishlist",
        },
        res
      );

    // Jika produk tidak terdapat pada wishlist maka tambahkan ke wishlist
    userWishlist.product.push(productId);
    const updatedWishlist = await updateWishlistByUserId(
      user._id,
      userWishlist
    );

    return response(
      {
        data: updatedWishlist,
        statusCode: 200,
        message: "Successfully add product to user wishlist",
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const removeWishlistController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userEmail = req.session?.email;
  if (!userEmail)
    return response(
      { data: null, statusCode: 404, message: "User session not found" },
      res
    );

  const { id: productId } = req.params;
  if (!productId)
    return response(
      { data: null, statusCode: 400, message: "Product ID is mandatory" },
      res
    );

  try {
    const user = await getUserByEmail(userEmail);
    // Pastikan user ada pada DB
    if (!user)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "User not found",
        },
        res
      );

    const product = await getProductById(productId);
    //Pastikan productId valid dan ada
    if (!product)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "Product not found",
        },
        res
      );

    const userWishlist = await getWishlistByUserId(user._id);

    // Jika user wishlist kosong maka tolak request user
    if (!userWishlist) {
      return response(
        {
          data: null,
          statusCode: 404,
          message: "User wishlist is empty",
        },
        res
      );
    }

    // Jika user wishlist ada maka cari index dari produk yang ingin dihapus
    const wishlistIndex = userWishlist.product.findIndex(
      (product) => product.toString() === productId
    );

    // Jika index dari produk yang ingin dihapus ditemukan maka ...
    if (wishlistIndex > -1) {
      // Hapus produk dari array / list, lalu update DB
      userWishlist.product.splice(wishlistIndex, 1);
      const updatedWishlist = await updateWishlistByUserId(
        user._id,
        userWishlist
      );
      return response(
        {
          data: updatedWishlist,
          statusCode: 200,
          message: "Successfully remove product from user wishlist",
        },
        res
      );
    }

    // Jika index dari produk tidak ditemukan pada wishlist maka hentikan request user
    return response(
      {
        data: null,
        statusCode: 404,
        message: "Product not found in wishlist",
      },
      res
    );
  } catch (error) {
    next(error);
  }
};
