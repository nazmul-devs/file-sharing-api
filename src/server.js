import http from "http";
import app from "./app.js";

import { appConfig } from "./core/config/config.js";
import { logger } from "./core/utils/logger.js";
import { cleanupJob } from "./jobs/cleanupJob.js";

const PORT = appConfig.port || 3000;
let server;

async function startServer() {
  try {
    server = http.createServer(app);

    // Start cleanup job
    cleanupJob();

    server.listen(PORT, () => {
      logger.info(
        `🚀 ${appConfig.appName} is running on http://localhost:${PORT}`
      );
    });

    // Graceful shutdown handlers
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error("❌ Failed to start server: " + error.message);
    process.exit(1);
  }
}

// Uncaught error handlers
process.on("uncaughtException", (err) => {
  logger.error("💥 Uncaught Exception: " + err.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("💥 Unhandled Rejection: " + reason);
  process.exit(1);
});

async function shutdown() {
  logger.info("🛑 Shutting down server...");

  server?.close(() => {
    logger.info("🧹 Server closed");
    process.exit(0);
  });
}

startServer();
