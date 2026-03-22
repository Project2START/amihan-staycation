import { Request, Response } from "express";
import { signToken } from "../../../shared/helpers/jwt";
import { cookieOptions } from "../../../shared/helpers/cookieOptions";
import { userAuthService } from "../services/userAuth.service";
import { generateSecureRandom } from "../../../shared/helpers/generators/generateSecureRandom";
import { BadRequestError } from "../../../shared/helpers/appErrors";
import { passwordResetService } from "../../auth/services/passwordReset.service";

const getSafeRedirectPath = (path?: string) => {
  if (!path) return "/auth";
  if (!path.startsWith("/")) return "/auth";
  if (path.startsWith("//")) return "/auth";

  return path;
};

class UserAuthController {
  async signUp(req: Request, res: Response) {
    const user = await userAuthService.signUp(req.body);

    const payload = {
      user_id: user.id,
      user_role: user.role,
      auth_version: user.auth_version,
    };
    const jwt_token = signToken(payload, "24h");

    res.cookie("auth_token", jwt_token, cookieOptions(24 * 60 * 60 * 1000));

    res.status(201).json({ message: "Account successfully created" });
  }
  async signIn(req: Request, res: Response) {
    const user = await userAuthService.signIn(req.body);

    const payload = {
      user_id: user.id,
      user_role: user.role,
      auth_version: user.auth_version,
    };
    const jwt_token = signToken(payload, "24h");

    res.cookie("auth_token", jwt_token, cookieOptions(24 * 60 * 60 * 1000));

    res.status(201).json({ message: "Account successfully signed it" });
  }
  async googleAuth(req: Request, res: Response) {
    const state = generateSecureRandom();
    const authorizationUrl = await userAuthService.googleAuth(state);
    const redirectPath = getSafeRedirectPath(req.query.redirect as string);

    req.session.state = state;
    req.session.redirectPath = redirectPath;

    res.redirect(authorizationUrl);
  }
  async googleAuthCallback(req: Request, res: Response) {
    const { code, state, error } = req.query;
    const redirectPath = getSafeRedirectPath(req.session.redirectPath);
    const signInRedirect = `${process.env.FRONTEND_HOST}/sign-in?redirect=${encodeURIComponent(redirectPath)}`;

    if (error) {
      req.session.redirectPath = undefined;
      res.redirect(signInRedirect);
      throw new BadRequestError("User denied access or OAuth error occurred.");
    }

    if (req.session.state !== state) {
      req.session.redirectPath = undefined;
      res.redirect(signInRedirect);
      throw new BadRequestError("Invalid state parameter");
    }

    if (!code) {
      req.session.redirectPath = undefined;
      res.redirect(signInRedirect);
      throw new BadRequestError("Authorization code missing.");
    }

    const user = await userAuthService.googleAuthCallback(code as string);

    const payload = {
      user_id: user.id,
      user_role: user.role,
      auth_version: user.auth_version,
    };

    const jwt_token = signToken(payload, "24h");

    res.cookie("auth_token", jwt_token, cookieOptions(24 * 60 * 60 * 1000));

    req.session.redirectPath = undefined;

    return res.redirect(`${process.env.FRONTEND_HOST}${redirectPath}`);

    // throw new ForbiddenError("You do not have permission to sign in");
  }
  async logout(_: Request, res: Response) {
    const cookieOptions = {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "none" as const,
      path: "/",
      expires: new Date(0),
    };

    res.cookie("user_id", "", cookieOptions);
    res.cookie("auth_token", "", cookieOptions);

    res.status(200).json({ message: "User successfully log out" });
  }

  async requestPasswordReset(req: Request, res: Response) {
    const result = await passwordResetService.requestPasswordReset(
      req.body.email,
      req.ip ?? "unknown",
      req.body.source ?? "auth",
    );

    res.status(200).json(result);
  }

  async validatePasswordResetToken(req: Request, res: Response) {
    const result = await passwordResetService.validateResetToken(
      req.body.token,
    );
    res.status(200).json(result);
  }

  async completePasswordReset(req: Request, res: Response) {
    const result = await passwordResetService.resetPassword({
      token: req.body.token,
      password: req.body.password,
      source: req.body.source ?? "auth",
      ipAddress: req.ip ?? "unknown",
    });

    res.status(200).json(result);
  }
}

export const userAuthController = new UserAuthController();
