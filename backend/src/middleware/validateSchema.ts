import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

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
