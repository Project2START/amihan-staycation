import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../shared/helpers/jwt";
import { getAuthTokenFromRequest } from "../shared/helpers/getAuthTokenFromRequest";

export function authAttacher(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getAuthTokenFromRequest(req);

    if (!token) {
      return next();
    }

    const decoded = verifyToken(token);

    (req as any).user = decoded;

    next();
  } catch (err) {
    if (req.cookies?.auth_token) {
      res.clearCookie("auth_token");
    }
    return next();
  }
}
