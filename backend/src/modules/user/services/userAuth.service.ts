import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";
import { registreeAuthService } from "../../registree/services/registreeAuth.service";
import { userRepository } from "../repositories/user.repository";
import { registreeRepository } from "../../registree/repositories/registree.repository";
import { google } from "googleapis";
import { UserSignInDTO, UserSignUpDTO } from "../schemas/userAuth.schema";
import bcrypt from "bcrypt";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

export class UserAuthService {
  async signUp(userDTO: UserSignUpDTO) {
    const registree = await registreeAuthService.verifyVCode(userDTO.id);

    const { first_name, last_name, email, password, verificationCode, id } =
      registree;

    await this.emailAvailability(email);

    const verifiedCode = verificationCode.match(userDTO.verificationCode);

    if (!verifiedCode) {
      throw new BadRequestError("Invalid verification code");
    }

    const newUser = await userRepository.create({
      first_name,
      last_name,
      email,
      password,
    });

    await registreeRepository.deleteManyByEmail(email);

    return newUser;
  }

  async signIn(userDTO: UserSignInDTO) {
    const { email, password } = userDTO;

    const user = await userRepository.findByEmail(email);

    const INVALID_CREDENTIALS = "Invalid email or password";

    if (!user || !user.password) {
      throw new NotFoundError(INVALID_CREDENTIALS);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new NotFoundError(INVALID_CREDENTIALS);
    }

    return user;
  }

  async googleAuth(state: string) {
    const scopes = ["openid", "profile", "email"];

    const authorizationUrl = oAuth2Client.generateAuthUrl({
      include_granted_scopes: true,
      state,
      scope: scopes,
    });

    return authorizationUrl;
  }

  async googleAuthCallback(code: string) {
    const { tokens } = await oAuth2Client.getToken(code);

    oAuth2Client.setCredentials(tokens);

    const { id_token } = tokens;

    if (!id_token) {
      throw new BadRequestError("Google did not return an ID token.");
    }

    const google_user = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString()
    );

    const { email, given_name, family_name, picture, sub, email_verified } =
      google_user;

    if (!email_verified) {
      throw new BadRequestError("Email not verified by Google");
    }

    const user = await userRepository.findByGoogleId(sub);

    if (user) {
      return user;
    }

    const newUser = await userRepository.create({
      email,
      first_name: given_name,
      last_name: family_name,
      avatar_url: picture,
      google_id: sub,
    });

    await registreeRepository.deleteManyByEmail(email);

    return newUser;
  }

  async emailAvailability(email: string) {
    const user = await userRepository.findByEmail(email);

    if (user) {
      throw new ConflictError(
        "Email already in use. Please provide a different one."
      );
    }

    return user;
  }
}

export const userAuthService = new UserAuthService();
