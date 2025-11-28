/**
 * Custom error classes for structured error handling in an application.
 *
 * `AppError` is the base class with a status code and an `isOperational` flag
 * to distinguish expected errors from programming errors.
 *
 * Specialized errors extend `AppError`:
 * - `BadRequestError` (400)
 * - `ConflictError` (409)
 * - `NotFoundError` (404)
 *
 * These classes help standardize error responses in APIs or middleware.
 */

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}
