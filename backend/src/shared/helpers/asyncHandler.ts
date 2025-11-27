import { Request, Response, NextFunction } from "express";

export const asyncHandler =
  (fn: Function) => (req: Request, resp: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, resp, next)).catch(next);
  };
