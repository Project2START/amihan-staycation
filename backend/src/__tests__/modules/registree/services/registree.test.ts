import { sendVerificationCode } from "../../../../modules/registree/helpers/sendVerificationCode";
import { registreeRepository } from "../../../../modules/registree/repositories/registree.repository";
import { registreeService } from "../../../../modules/registree/services/registree.service";
import { userAuthService } from "../../../../modules/user/services/userAuth.service";
import { ConflictError } from "../../../../shared/helpers/appErrors";
import generateHashedPassword from "../../../../shared/helpers/generators/generateHashedPassword";
import { generateOtp } from "../../../../shared/helpers/generators/generateOtp";

jest.mock("../../../../modules/user/services/userAuth.service");
jest.mock("../../../../modules/registree/repositories/registree.repository");
jest.mock("../../../../modules/registree/helpers/sendVerificationCode");
jest.mock("../../../../shared/helpers/generators/generateHashedPassword");
jest.mock("../../../../shared/helpers/generators/generateOtp");

describe("RegistreeService", () => {
  let mockInput: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };

  let mockData: {
    firstName: string;
    lastName: string;
    email: string;
    hashedPassword: string;
    codeExpiry: Date;
    resendCountdown: Date;
    otp: string;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockInput = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
    };

    mockData = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      hashedPassword: "hashed-password",
      codeExpiry: new Date(Date.now() + 10 * 60 * 1000),
      resendCountdown: new Date(Date.now() + 30 * 1000),
      otp: "123456",
    };
  });

  describe("create()", () => {
    it("creates a registree successfully", async () => {
      (userAuthService.emailAvailability as jest.Mock).mockResolvedValue(
        undefined
      );
      (registreeRepository.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...mockData,
        verificationCode: mockData.otp,
      });

      jest
        .spyOn(registreeService, "prepareRegistrationData")
        .mockResolvedValue(mockData);

      const result = await registreeService.create(mockInput);

      expect(userAuthService.emailAvailability).toHaveBeenCalledWith(
        mockInput.email
      );
      expect(registreeService.prepareRegistrationData).toHaveBeenCalledWith(
        mockInput
      );
      expect(registreeRepository.create).toHaveBeenCalledWith({
        first_name: mockData.firstName,
        last_name: mockData.lastName,
        email: mockData.email,
        password: mockData.hashedPassword,
        codeExpiry: mockData.codeExpiry,
        nextAllowedResend: mockData.resendCountdown,
        verificationCode: mockData.otp,
      });
      expect(sendVerificationCode).toHaveBeenCalledWith(
        mockData.otp,
        mockData.email
      );
      expect(result).toHaveProperty("id", 1);
    });

    it("fails to create registree due to email already in use", async () => {
      (userAuthService.emailAvailability as jest.Mock).mockRejectedValue(
        new ConflictError(
          "Email already in use. Please provide a different one."
        )
      );

      await expect(registreeService.create(mockInput)).rejects.toMatchObject({
        statusCode: 409,
        message: "Email already in use. Please provide a different one.",
      });

      expect(registreeService.prepareRegistrationData).not.toHaveBeenCalled();
      expect(registreeRepository.create).not.toHaveBeenCalled();
      expect(sendVerificationCode).not.toHaveBeenCalled();
    });

    it("fails if repository.create throws an error", async () => {
      (userAuthService.emailAvailability as jest.Mock).mockResolvedValue(
        undefined
      );
      jest
        .spyOn(registreeService, "prepareRegistrationData")
        .mockResolvedValue(mockData);
      (registreeRepository.create as jest.Mock).mockRejectedValue(
        new Error("DB failure")
      );

      await expect(registreeService.create(mockInput)).rejects.toThrow(
        "DB failure"
      );
      expect(sendVerificationCode).not.toHaveBeenCalled();
    });
  });

  describe("prepareRegistrationData()", () => {
    it("returns correct registration data", async () => {
      (generateHashedPassword as jest.Mock).mockResolvedValue(
        "hashed-password"
      );
      (generateOtp as jest.Mock).mockReturnValue("123456");

      const result = await registreeService.prepareRegistrationData(mockInput);

      expect(result).toMatchObject({
        firstName: mockInput.firstName,
        lastName: mockInput.lastName,
        email: mockInput.email,
        otp: "123456",
        hashedPassword: "hashed-password",
      });
      expect(result.codeExpiry.getTime()).toBeGreaterThan(Date.now());
      expect(result.resendCountdown.getTime()).toBeGreaterThan(Date.now());
    });
  });
});
