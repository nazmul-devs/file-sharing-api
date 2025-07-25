/**
 * Base HTTP error class for consistent error handling
 */


export class HttpError extends Error {
  constructor(statusCode = 500, message = 'Internal Server Error', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends HttpError {
  constructor(message = "Bad Request", details) {
    super(400, message, details);
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", details) {
    super(401, message, details);
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", details) {
    super(403, message, details);
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends HttpError {
  constructor(message = "Not Found", details) {
    super(404, message, details);
  }
}

/**
 * 409 Conflict
 */
export class ConflictError extends HttpError {
  constructor(message = "Conflict", details) {
    super(409, message, details);
  }
}

/**
 * 500 Server Error
 */
export class ServerError extends HttpError {
  constructor(message = "Server Error", details) {
    super(500, message, details);
  }
}
