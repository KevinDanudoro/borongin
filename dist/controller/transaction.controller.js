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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionController = void 0;
const uuid_1 = require("uuid");
const midtrans_1 = require("../helpers/midtrans");
const response_1 = require("../helpers/response");
const action_1 = require("../model/user/action");
const createTransactionController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.session) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail)
        return (0, response_1.response)({ data: null, statusCode: 400, message: "User session not found" }, res);
    try {
        const user = yield (0, action_1.getUserByEmail)(userEmail)
            .select("+cart.product +cart.quantity")
            .populate("cart.product");
        const price = user === null || user === void 0 ? void 0 : user.cart.map((c) => c.quantity * c.product.price).reduce((a, b) => a + b);
        const transactionParameter = {
            transaction_details: {
                order_id: (0, uuid_1.v4)(),
                gross_amount: price,
            },
            credit_card: {
                secure: true,
            },
            customer_details: {
                first_name: user === null || user === void 0 ? void 0 : user.username,
                email: user === null || user === void 0 ? void 0 : user.email,
            },
        };
        const snapToken = yield midtrans_1.midtrans.createTransactionToken(transactionParameter);
        return (0, response_1.response)({
            data: { transactionToken: snapToken },
            statusCode: 200,
            message: "Successfully create transaction",
        }, res);
    }
    catch (error) {
        if (error instanceof Error)
            return next(error.message);
        next(error);
    }
});
exports.createTransactionController = createTransactionController;
//# sourceMappingURL=transaction.controller.js.map