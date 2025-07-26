import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import router from "./api/routes/routes.js";
import errorMiddleware from "./core/middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(express.json());

// Routes
app.get("/", (_req, res) => {
  res.send("Welcome to the File Sharing API");
});

app.use("/", router);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "API not found" });
});

// Error handling middleware
app.use(errorMiddleware);

export default app;
