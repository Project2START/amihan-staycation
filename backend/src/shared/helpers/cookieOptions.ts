import { CookieOptions } from "express";

/**
 * Generates standardized cookie options for setting HTTP cookies.
 * Ensures cookies are secure, HTTP-only, and compatible with cross-site requests.
 *
 * @param cookieMaxAge - Maximum age of the cookie in milliseconds.
 * @returns An object conforming to Express's `CookieOptions`.
 */

export function cookieOptions(cookieMaxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: cookieMaxAge,
  };
}
