import jwt from "jsonwebtoken";

/**
 * Utility functions for signing and verifying JSON Web Tokens (JWTs).
 *
 * `signToken` creates a JWT with a given payload and expiration time.
 * `verifyToken` checks the validity of a JWT and returns its decoded payload.
 *
 * @param payload - The data to include in the JWT.
 * @param expiration - Token expiration time (currently supports "24h").
 * @param token - The JWT string to verify.
 * @returns A signed JWT string (for `signToken`) or the decoded payload (for `verifyToken`).
 */

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
type EXPIRES_IN = "24h" | "10m";

export function signToken(payload: object, expiration: EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiration });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
