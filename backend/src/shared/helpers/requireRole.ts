import { ForbiddenError, UnauthorizedError } from "./appErrors";

export function requireRole(user: any, allowedRoles: string[]) {
  if (!allowedRoles.includes(user.user_role)) {
    throw new ForbiddenError("Forbidden: insufficient role");
  }
}
