import crypto from "crypto";
import { BadRequestError } from "../appErrors";
// replace with your error class

/**
 * Generate a unique file path for an uploaded file
 * @param file - file object from multer (or similar)
 * @param folder - optional folder prefix (default: "uploads")
 * @returns string - path to store the file
 */
export function generateFilePath(
  file: { buffer?: Buffer; originalname?: string },
  folder = "uploads",
): string {
  if (!file.buffer) {
    throw new BadRequestError("Invalid file buffer");
  }

  if (!file.originalname) {
    throw new BadRequestError("File must have an original name");
  }

  // Get file extension
  const ext = file.originalname.split(".").pop();
  if (!ext) {
    throw new BadRequestError("File must have an extension");
  }

  // Generate random filename
  const fileName = `${crypto.randomUUID()}.${ext}`;

  // Combine folder + filename
  return `${folder}/${fileName}`;
}
