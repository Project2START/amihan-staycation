import { UnauthorizedError } from "./appErrors";

export function requireAuth({ user }: { user: any }) {
  if (!user) {
    throw new UnauthorizedError("Not authenticated");
  }
}
