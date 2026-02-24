import {
  BadRequestError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";
import { checkCodeExpiration } from "../../../shared/helpers/checkers/checkCodeExpiration";
import { generateOtp } from "../../../shared/helpers/generators/generateOtp";
import { registreeRepository } from "../repositories/registree.repository";
import { sendVerificationCode } from "../helpers/sendVerificationCode";

class RegistreeAuthService {
  async verifyVCode(id: string) {
    const registree = await registreeRepository.findById(id);

    if (!registree) {
      throw new NotFoundError("Record not found");
    }

    const isExpired = checkCodeExpiration(registree.codeExpiry);
    if (isExpired) {
      await registreeRepository.delete(registree.id);
      throw new BadRequestError("Verification code has expired");
    }
    return registree;
  }
  async resendVCode(id: string) {
    const registree = await this.verifyVCode(id);

    if (registree.nextAllowedResend > new Date()) {
      throw new BadRequestError("You can only resend after 30 seconds");
    }

    const otp = generateOtp();

    const updatedRegistree = await registreeRepository.update(registree.id, {
      resendCount: { increment: 1 },
      nextAllowedResend: new Date(Date.now() + 30 * 1000),
      verificationCode: otp,
    });

    await sendVerificationCode(
      updatedRegistree.verificationCode,
      updatedRegistree.email
    );

    return updatedRegistree;
  }
}
export const registreeAuthService = new RegistreeAuthService();
