"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = exports.generateSalt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateSalt = () => crypto_1.default.randomBytes(128).toString("base64");
exports.generateSalt = generateSalt;
const authentication = (password, salt) => process.env.SECRET
    ? crypto_1.default.pbkdf2Sync(password, salt, 1000, 64, "sha256").toString("hex")
    : null;
exports.authentication = authentication;
//# sourceMappingURL=hashing.js.map