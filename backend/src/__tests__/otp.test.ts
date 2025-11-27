import { generateOTP } from "../shared/helpers/generators/generateOtp";

describe("generateOTP", () => {
  it("should generate a 6-digit numeric OTP by default", () => {
    const otp = generateOTP();
    expect(otp).toHaveLength(6);
    expect(/^\d{6}$/.test(otp)).toBe(true);
  });

  it("should generate OTP of custom length", () => {
    const otp = generateOTP(8);
    expect(otp).toHaveLength(8);
    expect(/^\d{8}$/.test(otp)).toBe(true);
  });

  //   const invalidInputs = [
  //     ["hello world", "non-numeric input"],
  //     [-12, "negative length"],
  //     [0, "zero length"],
  //   ];
});
