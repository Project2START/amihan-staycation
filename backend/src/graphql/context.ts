import { Request } from "express";
import { verifyToken } from "../shared/helpers/jwt";
import { generateBookingModel } from "../modules/booking";

export const createContext = ({ req }: { req: Request }) => {
  const cookieHeader = req.headers.cookie || "";

  const token = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("auth_token="))
    ?.split("=")[1];

  let user;

  if (token) {
    user = verifyToken(token);
  } else {
    user = null;
  }

  return { user, models: { Booking: generateBookingModel({ user }) } };
};
