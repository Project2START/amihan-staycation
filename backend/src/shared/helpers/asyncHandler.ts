import { Request, Response, NextFunction } from "express";

/**
 * Wraps an asynchronous Express route handler to automatically catch errors
 * and pass them to the next middleware (typically an error handler).
 *
 * @param fn - The async route handler function to wrap.
 * @returns A new function that handles promise rejections and forwards errors.
 */

export const asyncHandler =
  (fn: Function) => (req: Request, resp: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, resp, next)).catch(next);
  };
