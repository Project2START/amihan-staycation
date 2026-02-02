// middleware/requireAuth.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../shared/helpers/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.auth_token; // <-- comes from cookieParser

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);

    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
