import crypto from "crypto";

/**
 * Generates a cryptographically secure random string.
 *
 * Uses Node.js's `crypto` module to create 32 random bytes and converts
 * them to a hexadecimal string, suitable for tokens, keys, or secrets.
 *
 * @returns A 64-character hexadecimal string.
 */

export function generateSecureRandom() {
  return crypto.randomBytes(32).toString("hex");
}
