import { Request } from "express";

export function getAuthTokenFromRequest(req: Request) {
  const header = req.headers.authorization;
  const authHeader = Array.isArray(header) ? header[0] : header;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  return req.cookies?.auth_token;
}
