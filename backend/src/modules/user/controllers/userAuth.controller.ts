import { Request, Response } from "express";
import { signToken } from "../../../shared/helpers/jwt";
import { cookieOptions } from "../../../shared/helpers/cookieOptions";
import { userAuthService } from "../services/userAuth.service";
import { generateSecureRandom } from "../../../shared/helpers/generators/generateSecureRandom";
import { BadRequestError } from "../../../shared/helpers/appErrors";

export class UserAuthController {
  async signUp(req: Request, res: Response) {
    const user = await userAuthService.signUp(req.body);

    const payload = { user_id: user.id, user_role: user.role };
    const jwt_token = signToken(payload, "24h");

    res.cookie("auth_token", jwt_token, cookieOptions(24 * 60 * 60 * 1000));

    res.status(201).json({ message: "Account successfully created" });
  }
  async signIn(req: Request, res: Response) {
    const user = await userAuthService.signIn(req.body);

    const payload = { user_id: user.id, user_role: user.role };
    const jwt_token = signToken(payload, "24h");

    res.cookie("auth_token", jwt_token, cookieOptions(24 * 60 * 60 * 1000));

    res.status(201).json({ message: "Account successfully signed it" });
  }
  async googleAuth(req: Request, res: Response) {
    const state = generateSecureRandom();
    const authorizationUrl = await userAuthService.googleAuth(state);

    req.session.state = state;

    res.redirect(authorizationUrl);
  }
  async googleAuthCallback(req: Request, res: Response) {
    const { code, state, error } = req.query;

    if (error) {
      throw new BadRequestError("User denied access or OAuth error occurred.");
    }

    if (req.session.state !== state) {
      throw new BadRequestError("Invalid state parameter");
    }

    if (!code) {
      throw new BadRequestError("Authorization code missing.");
    }

    const user = await userAuthService.googleAuthCallback(code as string);

    const payload = { user_id: user.id, user_role: user.role };

    const jwt_token = signToken(payload, "24h");

    res.cookie("auth_token", jwt_token, cookieOptions(24 * 60 * 60 * 1000));

    res.redirect(`${process.env.FRONTEND_HOST}/dashboard`);
  }
}

export const userAuthController = new UserAuthController();
