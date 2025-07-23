import { config } from "dotenv";
import express from "express";
import fileRouter from "./api/files.controller.js";
import cloudRoute from "./routes/file.routes.js";
config(); // Load environment variables

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the File Sharing API");
});

app.use("/files", fileRouter);
app.use("/cloud", cloudRoute);

// Error handling middleware
app.use(errorMiddleware);

export default app;
