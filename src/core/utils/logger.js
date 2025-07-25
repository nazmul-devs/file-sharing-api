import { existsSync, mkdirSync } from "fs";
import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file"; // Fixed import
import { appConfig } from "../config/config.js";

// Ensure log directory exists
const logDir = "logs";
if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

// Define log format
const logFormat = winston.format.printf(
  ({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  }
);

const logger = winston.createLogger({
  level: appConfig.nodeEnv === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), logFormat),
    }),
    // Daily rotate file transport for errors
    new DailyRotateFile({
      // Fixed: Using directly imported DailyRotateFile
      level: "error",
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      format: winston.format.combine(winston.format.uncolorize(), logFormat),
    }),
    // Daily rotate file transport for all logs
    new DailyRotateFile({
      // Fixed: Using directly imported DailyRotateFile
      filename: path.join(logDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      format: winston.format.combine(winston.format.uncolorize(), logFormat),
    }),
  ],
  exitOnError: false,
});

// Add stream for morgan
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

export { logger };

