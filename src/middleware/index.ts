import express from "express";
import { response } from "../helpers/response";
import { verifyToken } from "../helpers/jwt";

const publicUrl = ["/auth/signup", "/auth/signin"];

export const authorization = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.cookies["Authentication"];

  const verifiedToken = verifyToken(token);
  if (!verifiedToken.data)
    return response(
      {
        data: null,
        statusCode: verifiedToken.statusCode,
        message: verifiedToken.message,
      },
      res
    );
  return next();
};

export const errorHandler = (
  err: express.Errback,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  return response(
    { data: null, statusCode: 500, message: err.toString() },
    res
  );
};
