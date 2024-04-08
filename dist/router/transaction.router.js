"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_controller_1 = require("../controller/transaction.controller");
exports.default = (router) => {
    router.post("/transaction", transaction_controller_1.createTransactionController);
};
//# sourceMappingURL=transaction.router.js.map