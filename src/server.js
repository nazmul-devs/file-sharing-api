import fs from "fs";
import http from "http";
import app from "./app.js";
import { cleanupJob } from "./jobs/cleanupJob.js";
import { logger } from "./utils/logger.js";
import { normalizePort } from "./utils/helper.js";

// Ensure uploads folder exists
if (!fs.existsSync(process.env.FOLDER)) {
  fs.mkdirSync(process.env.FOLDER, { recursive: true });
}

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server
 */
const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event
 */
const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event
 */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Server listening on ${bind}`);
};

/**
 * Initialize storage provider and start server
 */
const initialize = async () => {
  try {
    // Start cleanup job (runs daily)
    cleanupJob();

    // Start server
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
  } catch (error) {
    logger.error("Failed to initialize application:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions and promise rejections
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Server terminated");
    process.exit(0);
  });
});

// Initialize application
initialize();
