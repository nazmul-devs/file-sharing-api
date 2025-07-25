import { HttpError } from "../../utils/errors.js";
import { logger } from "../../utils/logger.js";

/**
 * Error middleware with four parameters (err, req, res, next)
 * for centralized error handling
 */
const errorMiddleware = (err, req, res, next) => {
  // Log the error details
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Handle different error types appropriately
  if (err instanceof HttpError) {
    // Known HTTP errors (validation, not found, etc.)
    return res.status(err.statusCode).json({
      error: {
        code: err.statusCode,
        message: err.message,
        details: err.details || undefined,
      },
    });
  }

  if (err.name === "ValidationError") {
    // Mongoose or Joi validation errors
    return res.status(400).json({
      error: {
        code: 400,
        message: "Validation Error",
        details: err.details || err.errors,
      },
    });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    // Multer file size limit error
    return res.status(413).json({
      error: {
        code: 413,
        message: "File too large",
        details: err.message,
      },
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: {
        code: 401,
        message: "Invalid token",
        details: "Authentication failed",
      },
    });
  }

  // Default to 500 for unhandled errors
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Internal Server Error" : err.message;

  // Never expose stack traces in production
  const response = {
    error: {
      code: statusCode,
      message: message,
    },
  };

  // Include error details in development
  if (process.env.NODE_ENV === "development") {
    response.error.stack = err.stack;
    if (err.details) response.error.details = err.details;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;
