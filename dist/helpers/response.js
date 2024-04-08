"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
const response = (payload, res) => {
    res.status(payload.statusCode).json(payload).end();
};
exports.response = response;
//# sourceMappingURL=response.js.map