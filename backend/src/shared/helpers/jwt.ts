import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
type EXPIRES_IN = "24h";

export function signToken(payload: object, expiration: EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiration });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
