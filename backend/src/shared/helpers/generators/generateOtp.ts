import otpGenerator from "otp-generator";

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
