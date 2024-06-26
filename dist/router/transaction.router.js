"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_controller_1 = require("../controller/transaction.controller");
exports.default = (router) => {
    router.post("/transaction/product/:id", transaction_controller_1.createProductTransactionController);
    router.post("/transaction/cart", transaction_controller_1.createCartTransactionController);
};
//# sourceMappingURL=transaction.router.js.map