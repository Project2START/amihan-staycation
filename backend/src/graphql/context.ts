import { Request } from "express";
import { verifyToken } from "../shared/helpers/jwt";
import { generateBookingModel } from "../modules/booking";

export const createContext = ({ req }: { req: Request }) => {
  const authHeader = req.headers.authorization;
  const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;

  const bearerToken = headerValue?.startsWith("Bearer ")
    ? headerValue.slice("Bearer ".length).trim()
    : null;

  const cookieHeader = req.headers.cookie || "";
  const cookieToken = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("auth_token="))
    ?.split("=")[1];

  const token = bearerToken || cookieToken;

  let user;

  if (token) {
    user = verifyToken(token);
  } else {
    user = null;
  }

  return { user, models: { Booking: generateBookingModel({ user }) } };
};
