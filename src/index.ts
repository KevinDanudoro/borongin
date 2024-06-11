import http from "http";
import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import { rateLimit } from "express-rate-limit";

import router from "./router";
import { authorization, errorHandler } from "./middleware";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));
app.use(bodyParser.json());

app.use(authorization);

app.get("/", (_, res) => {
  res.send("Haloo");
});

const server = http.createServer(app);
server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL || "");
mongoose.connection.on("error", (error: Error) => console.log({ error }));

app.use("/", router());
app.use(errorHandler);
