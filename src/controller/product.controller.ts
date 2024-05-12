import express from "express";
import { response } from "../helpers/response";
import { createProductSchema, updateProductSchema } from "../schema/product";
import {
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
} from "../model/product/action";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../helpers/cloudinary";
import {
  getWishlistByUserId,
  removeProductFromWishlist,
} from "../model/wishlist/action";
import { getUserByEmail } from "../model/user/action";
import { getCartByUserId, removeProductFromCart } from "../model/cart/action";
import { getCategoryByName } from "../model/category/action";

export const createProductController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const session = req.session;
  if (!session)
    return response(
      { data: null, statusCode: 403, message: "User session not found" },
      res
    );

  const product = createProductSchema.safeParse(req.body);
  if (!product.success)
    return response(
      { data: null, statusCode: 400, message: "Bad product schema" },
      res
    );

  try {
    const isValidCategory = !!(await getCategoryByName(product.data.category));
    if (!isValidCategory)
      return response(
        { data: null, statusCode: 404, message: "Product category not found" },
        res
      );

    const productImage = req.files as Array<any>;
    const uploadUrl = await uploadToCloudinary(productImage, {
      folder: "product",
    });
    const dbProduct = await createProduct({
      ...product.data,
      imageUrl: uploadUrl,
    });
    return response(
      {
        data: dbProduct,
        statusCode: 201,
        message: "Successfully create new product",
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const getProductsController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const userEmail = req.session?.email;

  try {
    const dbProducts = await getProducts();

    if (userEmail) {
      const user = await getUserByEmail(userEmail);
      if (!user)
        return response(
          {
            data: dbProducts,
            statusCode: 200,
            message: "Successfully get all products",
          },
          res
        );

      const wishlist = await getWishlistByUserId(user._id);
      const carts = await getCartByUserId(user._id);

      const labeledProducts = dbProducts.map((product) => {
        if (!wishlist || !carts) return product;

        const cartProductIds = carts.cart.map((c) => c.product.toString());

        const labeledByWishlist = wishlist.product.includes(product._id)
          ? { ...product.toObject(), isWishlist: true }
          : { ...product.toObject(), isWishlist: false };
        const labeledByCart = cartProductIds.includes(
          labeledByWishlist._id.toString()
        )
          ? { ...labeledByWishlist, isCart: true }
          : { ...labeledByWishlist, isCart: false };

        return labeledByCart;
      });

      return response(
        {
          data: labeledProducts,
          statusCode: 200,
          message: "Successfully get all products",
        },
        res
      );
    }

    return response(
      {
        data: dbProducts,
        statusCode: 200,
        message: "Successfully get all products",
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const getProductByIdController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  if (!id)
    return response(
      { data: null, statusCode: 400, message: "Product ID is mandatory" },
      res
    );

  try {
    const dbProduct = await getProductById(id);
    return response(
      {
        data: dbProduct,
        statusCode: 200,
        message: "Successfully get product with id " + id,
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const updateProductByIdController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  if (!id)
    return response(
      { data: null, statusCode: 400, message: "Product ID is mandatory" },
      res
    );

  const updatedProduct = updateProductSchema.safeParse({
    ...req.body,
  });
  if (!updatedProduct.success)
    return response(
      { data: null, statusCode: 400, message: "Bad product schema" },
      res
    );

  try {
    const existingProduct = await getProductById(id);
    if (!existingProduct)
      return response(
        {
          data: null,
          statusCode: 404,
          message: "Product not found",
        },
        res
      );

    const isDelSuccess = await deleteFromCloudinary(
      updatedProduct.data.deleteImages ?? []
    );
    if (!isDelSuccess) throw new Error("Failed to delete resource from cloud");
    const imageUrlAfterDeletion = existingProduct.imageUrl.filter(
      (img) => !updatedProduct.data.deleteImages?.includes(img)
    );

    const productImage = req.files as Array<any>;
    const uploadUrl = await uploadToCloudinary(productImage, {
      folder: "product",
    });

    const dbProduct = await updateProductById(id, {
      ...updatedProduct.data,
      imageUrl: [...uploadUrl, ...imageUrlAfterDeletion],
    });
    return response(
      {
        data: dbProduct,
        statusCode: 201,
        message: "Successfully update product with id " + id,
      },
      res
    );
  } catch (error) {
    next(error);
  }
};

export const deleteProductByIdController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { id } = req.params;
  if (!id)
    return response(
      { data: null, statusCode: 400, message: "Product ID is mandatory" },
      res
    );

  try {
    // Hapus produk
    const dbProduct = await deleteProductById(id);

    // Hapus wishlist dan cart terkait
    const dbWishlist = await removeProductFromWishlist(id);
    const dbCart = await removeProductFromCart(id);

    // Hapus assets dari cloudinary
    const isDelSuccess = await deleteFromCloudinary(dbProduct?.imageUrl ?? []);
    if (!isDelSuccess) throw new Error("Failed to delete resource from cloud");

    return response(
      {
        data: { product: dbProduct, wishlist: dbWishlist, cart: dbCart },
        statusCode: 200,
        message: "Successfully delete product with id " + id,
      },
      res
    );
  } catch (error) {
    next(error);
  }
};
