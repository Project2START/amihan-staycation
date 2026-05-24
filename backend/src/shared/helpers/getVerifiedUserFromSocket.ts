import { Socket } from "socket.io";
import { parse } from "cookie";
import { verifyToken } from "../helpers/jwt";

export function getVerifiedUserFromSocket(socket: Socket): any {
  const cookies = socket.handshake.headers.cookie;
  const parsedCookies = parse(cookies || "");

  const authHeader = socket.handshake.headers.authorization;
  const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;

  const authFromHeader = headerValue?.startsWith("Bearer ")
    ? headerValue.slice("Bearer ".length).trim()
    : null;

  const authFromHandshake =
    typeof socket.handshake.auth?.token === "string"
      ? socket.handshake.auth.token
      : null;

  const authFromHandshakeBearer = authFromHandshake?.startsWith("Bearer ")
    ? authFromHandshake.slice("Bearer ".length).trim()
    : authFromHandshake;

  const auth_token =
    authFromHeader || authFromHandshakeBearer || parsedCookies.auth_token;

  if (!auth_token) {
    return null;
  }

  try {
    const user = verifyToken(auth_token);
    return user;
  } catch (err) {
    return null;
  }
}
