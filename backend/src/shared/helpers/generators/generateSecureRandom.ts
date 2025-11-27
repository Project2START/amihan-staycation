import crypto from "crypto";

export function generateSecureRandom() {
  return crypto.randomBytes(32).toString("hex");
}
