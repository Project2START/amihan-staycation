import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/helpers/appErrors";
import { ZodError } from "zod";

/**
 * Global error handling middleware for Express applications.
 *
 * Differentiates between:
 * - `AppError`: custom operational errors with a status code and message.
 * - `ZodError`: validation errors from Zod, returning all issue messages.
 * - Other unknown errors: returns a generic 500 Internal Server Error message.
 *
 * @param err - The error object thrown in the application.
 * @param req - The incoming Express request.
 * @param res - The Express response object.
 * @param next - The next middleware function (not used here but required by Express signature).
 */

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ errors: err.issues.map((issue) => issue.message) });
  }

  res
    .status(500)
    .json({ message: "Something went wrong. Please try again later" });
};
