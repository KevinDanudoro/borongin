"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_1 = require("../middleware");
const user_controller_1 = require("../controller/user.controller");
exports.default = (router) => {
    router.put("/user", middleware_1.upload.single("image"), user_controller_1.updateUserController);
    router.delete("/user", user_controller_1.deleteUserController);
};
//# sourceMappingURL=user.router.js.map