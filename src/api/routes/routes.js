import { Router } from "express";
import fileRouter from "../file_manager/fileManager.routes.js";

const router = Router();

// API Health Check
router.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

// Modular Routes
router.use("/files", fileRouter);

export default router;
