import bcrypt from "bcrypt";
import { AppError } from "../appErrors";

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
