import { sendVerificationCode } from "../../../../modules/registree/helpers/sendVerificationCode";
import { registreeRepository } from "../../../../modules/registree/repositories/registree.repository";
import { registreeAuthService } from "../../../../modules/registree/services/registreeAuth.service";
import {
  BadRequestError,
  NotFoundError,
} from "../../../../shared/helpers/appErrors";
import { checkCodeExpiration } from "../../../../shared/helpers/checkers/checkCodeExpiration";
import { generateOtp } from "../../../../shared/helpers/generators/generateOtp";

jest.mock("../../../../modules/registree/repositories/registree.repository");
jest.mock("../../../../shared/helpers/checkers/checkCodeExpiration");
jest.mock("../../../../shared/helpers/generators/generateOtp");
jest.mock("../../../../modules/registree/helpers/sendVerificationCode");

describe("RegistreeAuthService", () => {
  let mockRegistree: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRegistree = {
      id: "123",
      email: "john@example.com",
      codeExpiry: new Date(Date.now() + 5 * 60 * 1000),
      nextAllowedResend: new Date(Date.now() - 1000),
      verificationCode: "123456",
      resendCount: 0,
    };
  });

  describe("verifyVCode()", () => {
    it("returns registree if code is valid", async () => {
      (registreeRepository.findById as jest.Mock).mockResolvedValue(
        mockRegistree
      );
      (checkCodeExpiration as jest.Mock).mockReturnValue(false);

      const result = await registreeAuthService.verifyVCode(mockRegistree.id);

      expect(registreeRepository.findById).toHaveBeenCalledWith(
        mockRegistree.id
      );
      expect(checkCodeExpiration).toHaveBeenCalledWith(
        mockRegistree.codeExpiry
      );
      expect(result).toEqual(mockRegistree);
    });

    it("throws NotFoundError if registree not found", async () => {
      (registreeRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        registreeAuthService.verifyVCode("invalid-id")
      ).rejects.toThrow(NotFoundError);
      expect(checkCodeExpiration).not.toHaveBeenCalled();
    });

    it("throws BadRequestError and deletes registree if code expired", async () => {
      (registreeRepository.findById as jest.Mock).mockResolvedValue(
        mockRegistree
      );
      (checkCodeExpiration as jest.Mock).mockReturnValue(true);
      (registreeRepository.delete as jest.Mock).mockResolvedValue(undefined);

      await expect(
        registreeAuthService.verifyVCode(mockRegistree.id)
      ).rejects.toThrow(BadRequestError);

      expect(registreeRepository.delete).toHaveBeenCalledWith(mockRegistree.id);
    });
  });

  describe("resendVCode()", () => {
    it("resends verification code successfully", async () => {
      jest
        .spyOn(registreeAuthService, "verifyVCode")
        .mockResolvedValue(mockRegistree);
      (generateOtp as jest.Mock).mockReturnValue("654321");
      (registreeRepository.update as jest.Mock).mockResolvedValue({
        ...mockRegistree,
        verificationCode: "654321",
        resendCount: 1,
        nextAllowedResend: new Date(Date.now() + 30 * 1000),
      });

      const result = await registreeAuthService.resendVCode(mockRegistree.id);

      expect(registreeAuthService.verifyVCode).toHaveBeenCalledWith(
        mockRegistree.id
      );
      expect(generateOtp).toHaveBeenCalled();
      expect(registreeRepository.update).toHaveBeenCalled();
      expect(sendVerificationCode).toHaveBeenCalledWith(
        "654321",
        mockRegistree.email
      );
      expect(result.verificationCode).toBe("654321");
    });

    it("throws BadRequestError if resend is too soon", async () => {
      const soonRegistree = {
        ...mockRegistree,
        nextAllowedResend: new Date(Date.now() + 10000),
      };
      jest
        .spyOn(registreeAuthService, "verifyVCode")
        .mockResolvedValue(soonRegistree);

      await expect(
        registreeAuthService.resendVCode(mockRegistree.id)
      ).rejects.toThrow(BadRequestError);

      expect(generateOtp).not.toHaveBeenCalled();
      expect(registreeRepository.update).not.toHaveBeenCalled();
      expect(sendVerificationCode).not.toHaveBeenCalled();
    });
  });
});
