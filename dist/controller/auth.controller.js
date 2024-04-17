"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hashing_1 = require("../helpers/hashing");
const action_1 = require("../model/user/action");
const user_1 = require("../schema/user");
const response_1 = require("../helpers/response");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = user_1.signUpUserSchema.safeParse(req.body);
    if (!user.success)
        return (0, response_1.response)({ data: user.error, statusCode: 400, message: "Bad user schema" }, res);
    const { email, username, password } = user.data;
    const exisistingUser = yield (0, action_1.getUserByEmail)(email);
    if (exisistingUser)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Email already used" }, res);
    const salt = (0, hashing_1.generateSalt)();
    const hashedPassword = (0, hashing_1.authentication)(password, salt);
    if (!hashedPassword)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "Password not match" }, res);
    const dbUser = yield (0, action_1.createUser)({
        email,
        username,
        authentication: {
            salt,
            password: hashedPassword,
        },
    });
    return (0, response_1.response)({ data: dbUser, message: "User successfuly created", statusCode: 201 }, res);
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = user_1.signInUserSchema.safeParse(req.body);
    if (!user.success)
        return (0, response_1.response)({ data: user.error, statusCode: 400, message: "Bad user schema" }, res);
    const { email, password } = user.data;
    const existingUser = yield (0, action_1.getUserByEmail)(email).select("+authentication.password +authentication.salt");
    if (!((_a = existingUser === null || existingUser === void 0 ? void 0 : existingUser.authentication) === null || _a === void 0 ? void 0 : _a.password) ||
        !((_b = existingUser === null || existingUser === void 0 ? void 0 : existingUser.authentication) === null || _b === void 0 ? void 0 : _b.salt)) {
        return (0, response_1.response)({ data: null, statusCode: 500, message: "User credential not found" }, res);
    }
    const isPasswordSame = (0, hashing_1.authentication)(password, existingUser.authentication.salt) ===
        existingUser.authentication.password;
    if (!isPasswordSame)
        return (0, response_1.response)({ data: null, statusCode: 403, message: "Credential error" }, res);
    const token = jsonwebtoken_1.default.sign({
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username,
    }, process.env.SECRET || "", { expiresIn: 3600 });
    res.cookie("Authorization", token, {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        domain: "localhost", //process.env.DOMAIN,
    });
    return (0, response_1.response)({ data: existingUser, statusCode: 200, message: "Login access granted" }, res);
});
exports.signin = signin;
//# sourceMappingURL=auth.controller.js.map