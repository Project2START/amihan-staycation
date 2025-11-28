import bcrypt from "bcrypt";
import { AppError } from "../appErrors";

/**
 * Generates a securely hashed version of a given password using bcrypt.
 *
 * @param password - The plain text password to hash.
 * @param salt - Optional salt rounds (default is 10) to increase hash complexity.
 * @returns A promise that resolves to the hashed password string.
 * @throws AppError if the hashing process fails.
 */

export default async function generateHashedPassword(
  password: string,
  salt: number = 10
): Promise<string> {
  try {
    let hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new AppError(
      "Could not securely hash the password. Please try again."
    );
  }
}
