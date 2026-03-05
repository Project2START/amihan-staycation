import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../shared/helpers/jwt";

export function authAttacher(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.auth_token;

    if (!token) {
      return next();
    }

    const decoded = verifyToken(token);

    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
