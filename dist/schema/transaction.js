"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.transactionSchema = zod_1.default.array(zod_1.default.string());
//# sourceMappingURL=transaction.js.map