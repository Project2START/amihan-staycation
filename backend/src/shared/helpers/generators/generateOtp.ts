import otpGenerator from "otp-generator";

/**
 * Generates a numeric One-Time Password (OTP) of a specified length.
 *
 * @param length - The desired length of the OTP (default is 6). Must be greater than 0.
 * @returns A string containing the numeric OTP, or an error message if length is invalid.
 */

export function generateOtp(length: number = 6): string {
  if (length <= 0) {
    return "Invalid OTP length";
  }

  return otpGenerator.generate(length, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
}
