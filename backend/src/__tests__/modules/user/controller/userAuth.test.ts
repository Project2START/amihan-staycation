import { Request, Response } from "express";
import { userAuthService } from "../../../../modules/user/services/userAuth.service";
import { signToken } from "../../../../shared/helpers/jwt";
import { userAuthController } from "../../../../modules/user/controllers/userAuth.controller";
import { generateSecureRandom } from "../../../../shared/helpers/generators/generateSecureRandom";
import { BadRequestError } from "../../../../shared/helpers/appErrors";

jest.mock("../../../../modules/user/services/userAuth.service");
jest.mock("../../../../shared/helpers/jwt");
jest.mock("../../../../shared/helpers/generators/generateSecureRandom");

describe("UserAuthController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
      redirect: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // ------------------------
  // signUp
  // ------------------------
  describe("signUp", () => {
    it("should sign up a user and return 201", async () => {
      const mockUser = { id: "u1", role: "user", auth_version: 1 };
      (userAuthService.signUp as jest.Mock).mockResolvedValue(mockUser);

      req.body = { email: "test@example.com", password: "pass123" };

      await userAuthController.signUp(req as any, res as any);

      expect(userAuthService.signUp).toHaveBeenCalledWith(req.body);
      expect(signToken).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Account successfully created",
        user: {
          id: mockUser.id,
          role: mockUser.role,
          auth_version: mockUser.auth_version,
        },
      });
    });
  });

  // ------------------------
  // signIn
  // ------------------------
  describe("signIn", () => {
    it("should sign in a user and return 201", async () => {
      const mockUser = { id: "u1", role: "user", auth_version: 1 };
      (userAuthService.signIn as jest.Mock).mockResolvedValue(mockUser);

      req.body = { email: "test@example.com", password: "pass123" };

      await userAuthController.signIn(req as any, res as any);

      expect(userAuthService.signIn).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Account successfully signed it",
        user: {
          id: mockUser.id,
          role: mockUser.role,
          auth_version: mockUser.auth_version,
        },
      });
    });
  });

  // ------------------------
  // googleAuth
  // ------------------------
  describe("googleAuth", () => {
    it("should generate state, redirect to authorization URL, and store state in session", async () => {
      const mockUrl = "https://google.com/oauth";
      (userAuthService.googleAuth as jest.Mock).mockResolvedValue(mockUrl);
      (generateSecureRandom as jest.Mock).mockReturnValue("random-state");

      (req as any).session = {}; // cast session as any for TS
      await userAuthController.googleAuth(req as any, res as any);

      expect(generateSecureRandom).toHaveBeenCalled();
      expect((req as any).session.state).toBe("random-state");
      expect(userAuthService.googleAuth).toHaveBeenCalledWith("random-state");
      expect(res.redirect).toHaveBeenCalledWith(mockUrl);
    });
  });

  // ------------------------
  // googleAuthCallback
  // ------------------------
  describe("googleAuthCallback", () => {
    const FRONTEND_HOST = "http://localhost:3000";
    beforeAll(() => {
      process.env.FRONTEND_HOST = FRONTEND_HOST;
    });

    it("should throw BadRequestError if OAuth error exists", async () => {
      (req as any).session = {};
      req.query = { error: "access_denied" };

      await expect(
        userAuthController.googleAuthCallback(req as any, res as any),
      ).rejects.toThrow(BadRequestError);
      expect(res.redirect).toHaveBeenCalledWith(
        `${FRONTEND_HOST}/sign-in?redirect=%2Fauth`,
      );
    });

    it("should throw BadRequestError if state is invalid", async () => {
      (req as any).session = { state: "abc" };
      req.query = { code: "code123", state: "wrong" };

      await expect(
        userAuthController.googleAuthCallback(req as any, res as any),
      ).rejects.toThrow(BadRequestError);
      expect(res.redirect).toHaveBeenCalledWith(
        `${FRONTEND_HOST}/sign-in?redirect=%2Fauth`,
      );
    });

    it("should throw BadRequestError if code is missing", async () => {
      (req as any).session = { state: "abc" };
      req.query = { state: "abc" };

      await expect(
        userAuthController.googleAuthCallback(req as any, res as any),
      ).rejects.toThrow(BadRequestError);
      expect(res.redirect).toHaveBeenCalledWith(
        `${FRONTEND_HOST}/sign-in?redirect=%2Fauth`,
      );
    });

    it("should redirect to frontend callback on success", async () => {
      const mockUser = { id: "u1", role: "user", auth_version: 1 };
      (userAuthService.googleAuthCallback as jest.Mock).mockResolvedValue(
        mockUser,
      );
      (signToken as jest.Mock).mockReturnValue("jwt-token");

      (req as any).session = { state: "abc" };
      req.query = { state: "abc", code: "code123" };

      await userAuthController.googleAuthCallback(req as any, res as any);

      expect(userAuthService.googleAuthCallback).toHaveBeenCalledWith(
        "code123",
      );
      expect(signToken).toHaveBeenCalledWith(
        {
          user_id: mockUser.id,
          user_role: mockUser.role,
          auth_version: mockUser.auth_version,
        },
        "10m",
      );
      expect(res.redirect).toHaveBeenCalledWith(
        `${FRONTEND_HOST}/sign-in/google-callback?redirect=%2Fauth&token=jwt-token`,
      );
    });
  });
});
