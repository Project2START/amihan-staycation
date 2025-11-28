import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

/**
 * Express middleware to validate request bodies against a Zod schema.
 *
 * If validation succeeds, the parsed and validated data replaces `req.body`.
 * If validation fails, the error is passed to the next error-handling middleware.
 *
 * @param schema - A Zod schema used to validate the request body.
 * @returns An Express middleware function.
 */

export const validateSchema = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
