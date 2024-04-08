"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.midtrans = void 0;
const midtransClient = require("midtrans-client");
let globalMidtrans = globalThis;
exports.midtrans = (globalMidtrans.midtrans ||
    new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
    }));
//# sourceMappingURL=midtrans.js.map