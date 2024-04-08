"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("../controller/auth.controller");
exports.default = (router) => {
    router.post("/auth/signup", auth_controller_1.signup);
    router.post("/auth/signin", auth_controller_1.signin);
};
//# sourceMappingURL=auth.router.js.map