import http from "http";

import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Haloo");
});

const server = http.createServer(app);
server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
