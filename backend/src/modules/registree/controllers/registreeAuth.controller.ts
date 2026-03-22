import { Request, Response } from "express";
import { registreeAuthService } from "../services/registreeAuth.service";

class RegistreeAuthController {
  async verifyRegistree(req: Request, res: Response) {
    await registreeAuthService.verifyVCode(req.body.id);
    res.status(200).json({ message: "Registree was successfully verified" });
  }

  async resendRegistreeVCode(req: Request, res: Response) {
    const updatedRegistree = await registreeAuthService.resendVCode(
      req.body.id,
    );
    res.status(200).json({
      message: "Verification code has been successfully resent",
      nextAllowedResend: updatedRegistree.nextAllowedResend,
    });
  }
}

export const registreeAuthController = new RegistreeAuthController();
