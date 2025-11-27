import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/helpers/appErrors";
import { ZodError } from "zod";

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
