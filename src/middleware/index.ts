import express from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import jwt from "jsonwebtoken";

import { response } from "../helpers/response";
import { jwtUserSchema } from "../schema/user";

const publicApi = ["/auth/signup", "/auth/signin", "/"];

export const authorization = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.cookies["Authentication"];
  const isPublic = publicApi.includes(req.originalUrl);
  if (isPublic) return next();

  if (!token)
    return response(
      { data: null, statusCode: 401, message: "Unauthorized user" },
      res
    );

  try {
    const decodeToken = jwt.verify(token, process.env.SECRET || "");
    const parsedToken = jwtUserSchema.safeParse(decodeToken);

    if (!parsedToken.success)
      return response(
        {
          statusCode: 403,
          message: "Token is invalid",
          data: null,
        },
        res
      );

    req.session = {
      username: parsedToken.data.username,
      email: parsedToken.data.email,
    };
    next();
  } catch (error) {
    if (error instanceof Error)
      return response(
        {
          data: null,
          message: error.message,
          statusCode: 403,
        },
        res
      );

    throw new Error("Something went wrong");
  }
};

export const errorHandler = (
  err: express.Errback,
  _: express.Request,
  res: express.Response,
  __: express.NextFunction
) => {
  return response(
    { data: null, statusCode: 500, message: err.toString() },
    res
  );
};

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { files: 10, fileSize: 1 * 1024 * 1024 },
});
