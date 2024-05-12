import express from "express";
import { response } from "../helpers/response";
import { getUserByEmail } from "../model/user/action";
import { getProductById } from "../model/product/action";
import {
  createCartByUserId,
  getCartByUserId,
  updateCartByUserId,
} from "../model/cart/action";

export const getCartController = async (
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

    // Dapatkan cart dari DB
    const cart =
      (await getCartByUserId(user._id).populate("cart.product"))?.cart ?? [];
    return response(
      { data: cart, message: "Success get user cart", statusCode: 200 },
      res
    );
  } catch (err) {
    next(err);
  }
};

export const addCartController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userEmail = req.session?.email;
  if (!userEmail)
    return response(
      { data: null, statusCode: 403, message: "User session not found" },
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
    // Pastikan bahwa user benar ada
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

    const userCart = await getCartByUserId(user._id);

    // Jika user cart masih kosong maka buat baru
    if (!userCart) {
      const createdCart = await createCartByUserId({
        user: user._id,
        cart: [{ product: productId, quantity: 1 }],
      });
      return response(
        {
          data: createdCart,
          statusCode: 200,
          message: "Success adding product to user cart",
        },
        res
      );
    }

    // Cari produkId yang sama dengan cara menentukan index array-nya
    const cartIndex = userCart.cart.findIndex(
      (c) => c.product.toString() === productId
    );

    // Jika index ditemukan (> -1), kembalikan bahwa produk sudah terdapat pada cart
    if (cartIndex > -1)
      return response(
        {
          data: userCart,
          statusCode: 400,
          message: "Product already in cart",
        },
        res
      );

    // Jika produk tidak ditemukan pada cart, maka ...
    // tambahkan produk secara langsung ke cart dan set quantity ke 1
    userCart.cart.push({ product: productId, quantity: 1 });
    const updatedCart = await updateCartByUserId(user._id, userCart);
    return response(
      {
        data: updatedCart,
        statusCode: 200,
        message: "Success adding product to user cart",
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const removeCartController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userEmail = req.session?.email;
  if (!userEmail)
    return response(
      { data: null, statusCode: 403, message: "User session not found" },
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
    // Pastikan bahwa user benar ada
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
    // Pastikan bahwa product ID valid dan ada
    if (!product)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "Product not found",
        },
        res
      );

    const userCart = await getCartByUserId(user._id);

    // Jika user cart kosong maka batalkan request user
    if (!userCart) {
      return response(
        {
          data: null,
          statusCode: 404,
          message: "User cart is empty",
        },
        res
      );
    }

    // Mencari index dari produk yang ingin dihapus
    const cartIndex = userCart.cart.findIndex(
      (u) => u.product.toString() === productId
    );

    // Jika produk tidak ditemukan pada cart maka berikan response berikut
    if (cartIndex < 0)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "Product is not in the cart",
        },
        res
      );

    // Jika produk ditemukan pada index tertentu maka hapus produk pada cart
    userCart.cart.splice(cartIndex, 1);

    // Simpan hasil perubahan cart ke DB
    const updatedCart = await updateCartByUserId(user._id, userCart);
    return response(
      {
        data: updatedCart,
        statusCode: 200,
        message: "Success decrease product quantity from cart",
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const setCartQuantityController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userEmail = req.session?.email;
  const { id: productId } = req.params;
  const { quantity } = req.body;

  if (!userEmail)
    return response(
      { data: null, statusCode: 403, message: "User session not found" },
      res
    );

  if (!quantity || quantity < 0)
    return response(
      { data: null, statusCode: 400, message: "Quantity must greater than 0" },
      res
    );

  if (!productId)
    return response(
      { data: null, statusCode: 400, message: "Product id is mandatory" },
      res
    );

  try {
    const user = await getUserByEmail(userEmail);
    // Pastikan bahwa user benar ada
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
    // Pastikan bahwa product ID valid dan ada
    if (!product)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "Product not found",
        },
        res
      );

    const userCart = await getCartByUserId(user._id);
    // Jika user cart kosong maka batalkan request user
    if (!userCart) {
      return response(
        {
          data: null,
          statusCode: 404,
          message: "User cart is empty",
        },
        res
      );
    }

    const productCartIndex = userCart.cart.findIndex((cart) =>
      cart.product.includes(productId)
    );
    if (productCartIndex < 0)
      return response(
        { data: null, statusCode: 404, message: "Product not found in cart" },
        res
      );

    userCart.cart[productCartIndex] = {
      quantity,
      product: userCart.cart[productCartIndex].product,
    };
  } catch (err) {
    next(err);
  }
};
