import generateHashedPassword from "../../../shared/helpers/generators/generateHashedPassword";
import { generateOtp } from "../../../shared/helpers/generators/generateOtp";
import { registreeRepository } from "../repositories/registree.repository";
import { sendVerificationCode } from "../helpers/sendVerificationCode";
import { RegistreeDTO } from "../schemas/registree.schema";
import { userAuthService } from "../../user/services/userAuth.service";

export class RegistreeService {
  async create(registree: RegistreeDTO) {
    await userAuthService.emailAvailability(registree.email);

    const data = await this.prepareRegistrationData(registree);

    const newRegistree = await registreeRepository.create({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.hashedPassword,
      codeExpiry: data.codeExpiry,
      nextAllowedResend: data.resendCountdown,
      verificationCode: data.otp,
    });

    sendVerificationCode(newRegistree.verificationCode, newRegistree.email);

    return newRegistree;
  }

  async prepareRegistrationData(registree: RegistreeDTO) {
    let hashedPassword = await generateHashedPassword(registree.password);
    const otp = generateOtp();

    return {
      email: registree.email,
      firstName: registree.firstName,
      lastName: registree.lastName,
      otp,
      hashedPassword,
      codeExpiry: new Date(Date.now() + 10 * 60 * 1000),
      resendCountdown: new Date(Date.now() + 30 * 1000),
    };
  }
}

export const registreeService = new RegistreeService();
