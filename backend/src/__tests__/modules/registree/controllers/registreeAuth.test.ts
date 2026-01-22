import { registreeAuthController } from "../../../../modules/registree/controllers/registreeAuth.controller";
import { registreeAuthService } from "../../../../modules/registree/services/registreeAuth.service";
import {
  BadRequestError,
  NotFoundError,
} from "../../../../shared/helpers/appErrors";

jest.mock("../../../../modules/registree/services/registreeAuth.service");

describe("RegistreeAuthController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: { id: "abc123" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("verifyRegistree()", () => {
    it("should verify registree and return 200", async () => {
      (registreeAuthService.verifyVCode as jest.Mock).mockResolvedValue({
        id: req.body.id,
      });

      await registreeAuthController.verifyRegistree(req, res);

      expect(registreeAuthService.verifyVCode).toHaveBeenCalledWith(
        req.body.id
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Registree was successfully verified",
      });
    });

    it("should propagate errors from verifyVCode", async () => {
      const error = new NotFoundError("Record not found");
      (registreeAuthService.verifyVCode as jest.Mock).mockRejectedValue(error);

      await expect(
        registreeAuthController.verifyRegistree(req, res)
      ).rejects.toThrow(error);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("resendRegistreeVCode()", () => {
    it("should resend verification code and return 200", async () => {
      const mockRegistree = { nextAllowedResend: new Date(Date.now() + 30000) };
      (registreeAuthService.resendVCode as jest.Mock).mockResolvedValue(
        mockRegistree
      );

      await registreeAuthController.resendRegistreeVCode(req, res);

      expect(registreeAuthService.resendVCode).toHaveBeenCalledWith(
        req.body.id
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Verification code has been successfully resent",
        nextAllowedResend: mockRegistree.nextAllowedResend,
      });
    });

    it("should propagate errors from resendVCode", async () => {
      const error = new BadRequestError("Too soon to resend");
      (registreeAuthService.resendVCode as jest.Mock).mockRejectedValue(error);

      await expect(
        registreeAuthController.resendRegistreeVCode(req, res)
      ).rejects.toThrow(error);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
