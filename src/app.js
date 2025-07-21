import { config } from "dotenv";
import express from "express";
import fs from "fs";
import fileRouter from "./api/files.controller.js";
import { cleanupJob } from "./jobs/cleanupJob.js";
import rateLimiter from "./middlewares/rateLimiter.js";
config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads folder exists
if (!fs.existsSync(process.env.FOLDER)) {
  fs.mkdirSync(process.env.FOLDER, { recursive: true });
}

app.use(express.json());
app.use(rateLimiter); // IP-based limiter

app.use("/files", fileRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  cleanupJob(); // Start cleanup job
});
