import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../shared/helpers/jwt";

export function authMiddleware(
  req: Request,
  resp: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return resp.status(401).json({ message: "Authentication required." });

    const decoded = verifyToken(token);
    (req as any).user = decoded;

    next();
  } catch (err) {
    return resp.status(401).json({ message: "Invalid or expired token" });
  }
}
