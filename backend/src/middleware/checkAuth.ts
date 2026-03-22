import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../shared/helpers/jwt";
import { userRepository } from "../modules/user/repositories/user.repository";

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.auth_token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token) as {
      user_id: string;
      auth_version?: number;
    };

    // SEC: Validate auth token version against current user version to support server-side session revocation.
    const user = await userRepository.findById(decoded.user_id);
    if (!user || (decoded.auth_version ?? 0) !== user.auth_version) {
      return res.status(401).json({ message: "Invalid token" });
    }

    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
