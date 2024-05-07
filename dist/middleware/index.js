"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.errorHandler = exports.authorization = void 0;
const multer_1 = __importDefault(require("multer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../helpers/response");
const user_1 = require("../schema/user");
const publicApi = ["/", "/product"];
const authApi = ["/auth/signup", "/auth/signin"];
const authorization = (req, res, next) => {
    const token = req.cookies["Authorization"];
    const isPublic = publicApi.includes(req.originalUrl);
    const isAuth = authApi.includes(req.originalUrl);
    if (isAuth)
        return next();
    if (!token && isPublic)
        return next();
    if (!token)
        return (0, response_1.response)({ data: null, statusCode: 401, message: "Unauthorized user" }, res);
    try {
        const decodeToken = jsonwebtoken_1.default.verify(token, process.env.SECRET || "");
        const parsedToken = user_1.jwtUserSchema.safeParse(decodeToken);
        if (!parsedToken.success) {
            res.clearCookie("Authorization");
            if (isPublic)
                return next();
            return (0, response_1.response)({
                statusCode: 401,
                message: "Authentication token schema is invalid",
                data: null,
            }, res);
        }
        req.session = {
            username: parsedToken.data.username,
            email: parsedToken.data.email,
        };
        next();
    }
    catch (error) {
        res.clearCookie("Authorization");
        if (error instanceof Error)
            return (0, response_1.response)({
                data: null,
                message: error.message,
                statusCode: 401,
            }, res);
        throw new Error("Something went wrong");
    }
};
exports.authorization = authorization;
const errorHandler = (err, _, res, __) => {
    return (0, response_1.response)({ data: null, statusCode: 500, message: err.toString() }, res);
};
exports.errorHandler = errorHandler;
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: { files: 10, fileSize: 1 * 1024 * 1024 },
});
//# sourceMappingURL=index.js.map