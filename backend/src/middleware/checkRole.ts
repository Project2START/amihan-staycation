import { Request, Response, NextFunction } from "express";

// allowedRoles is an array of strings, e.g. ["admin", "editor"]
export function checkRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user; // must be set by requireAuth

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(user.user_role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    next();
  };
}
