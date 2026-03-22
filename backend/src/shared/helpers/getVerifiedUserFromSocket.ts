import { Socket } from "socket.io";
import { parse } from "cookie";
import { verifyToken } from "../helpers/jwt";

export function getVerifiedUserFromSocket(socket: Socket): any {
  const cookies = socket.handshake.headers.cookie;
  const parsedCookies = parse(cookies || "");

  const auth_token = parsedCookies.auth_token;

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
