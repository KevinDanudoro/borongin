"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_rate_limit_1 = require("express-rate-limit");
const router_1 = __importDefault(require("./router"));
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.rateLimit)({ windowMs: 15 * 60 * 1000, limit: 50 }));
app.use(body_parser_1.default.json());
app.use(middleware_1.authorization);
app.get("/", (_, res) => {
    res.send("Haloo");
});
const server = http_1.default.createServer(app);
server.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(process.env.MONGODB_URL || "");
mongoose_1.default.connection.on("error", (error) => console.log({ error }));
app.use("/", (0, router_1.default)());
app.use(middleware_1.errorHandler);
//# sourceMappingURL=index.js.map