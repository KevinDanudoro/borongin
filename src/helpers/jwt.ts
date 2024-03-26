import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtUserSchema } from "../schema/user";

export const verifyToken = (token: string) => {
  try {
    const decodeToken = jwt.verify(token, process.env.SECRET || "");
    const parsedToken = jwtUserSchema.safeParse(decodeToken);
    if (!parsedToken.success) {
      return {
        statusCode: 403,
        message: "Token is invalid",
        data: null,
      };
    }
    return {
      data: parsedToken.data,
      message: "Token verified",
      statusCode: 200,
    };
  } catch (error) {
    if (error instanceof Error)
      return {
        data: null,
        message: error.message,
        statusCode: 403,
      };

    throw new Error("Something went wrong");
  }
};
