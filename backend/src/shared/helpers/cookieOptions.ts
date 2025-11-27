import { CookieOptions } from "express";

export function cookieOptions(cookieMaxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: cookieMaxAge,
  };
}
