import bcrypt from "bcrypt";
import { registreeAuthService } from "../../../../modules/registree/services/registreeAuth.service";
import { userAuthService } from "../../../../modules/user/services/userAuth.service";
import { userRepository } from "../../../../modules/user/repositories/user.repository";
import { registreeRepository } from "../../../../modules/registree/repositories/registree.repository";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../shared/helpers/appErrors";

// ------------------------
// Mock external dependencies
// ------------------------
jest.mock("../../../../modules/registree/services/registreeAuth.service");
jest.mock("../../../../modules/user/repositories/user.repository");
jest.mock("../../../../modules/registree/repositories/registree.repository");

jest.mock("bcrypt");

// ------------------------
// Tests
// ------------------------
describe("UserAuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------------
  // signUp()
  // ------------------------
  describe("signUp()", () => {
    const mockRegistree = {
      id: "reg123",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      password: "hashed",
      verificationCode: "123456",
    };

    it("successfully creates a new user", async () => {
      (registreeAuthService.verifyVCode as jest.Mock).mockResolvedValue(
        mockRegistree,
      );
      jest.spyOn(userAuthService, "emailAvailability").mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockResolvedValue({
        ...mockRegistree,
        id: "user123",
      });
      (registreeRepository.deleteManyByEmail as jest.Mock).mockResolvedValue(
        undefined,
      );

      const result = await userAuthService.signUp({
        id: mockRegistree.id,
        verificationCode: "123456",
      });

      expect(registreeAuthService.verifyVCode).toHaveBeenCalledWith(
        mockRegistree.id,
      );
      expect(userRepository.create).toHaveBeenCalledWith({
        first_name: mockRegistree.first_name,
        last_name: mockRegistree.last_name,
        email: mockRegistree.email,
        password: mockRegistree.password,
      });
      expect(registreeRepository.deleteManyByEmail).toHaveBeenCalledWith(
        mockRegistree.email,
      );
      expect(result).toHaveProperty("id", "user123");
    });

    it("throws BadRequestError if verification code does not match", async () => {
      (registreeAuthService.verifyVCode as jest.Mock).mockResolvedValue(
        mockRegistree,
      );

      await expect(
        userAuthService.signUp({
          id: mockRegistree.id,
          verificationCode: "wrong",
        }),
      ).rejects.toThrow(BadRequestError);
    });

    it("throws ConflictError if email already exists", async () => {
      (registreeAuthService.verifyVCode as jest.Mock).mockResolvedValue(
        mockRegistree,
      );
      jest
        .spyOn(userAuthService, "emailAvailability")
        .mockRejectedValue(new ConflictError("Email already in use"));

      await expect(
        userAuthService.signUp({
          id: mockRegistree.id,
          verificationCode: "123456",
        }),
      ).rejects.toThrow(ConflictError);
    });
  });

  // ------------------------
  // signIn()
  // ------------------------
  describe("signIn()", () => {
    const mockUser = { email: "test@example.com", password: "hashed" };

    it("successfully signs in with correct credentials", async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await userAuthService.signIn({
        email: mockUser.email,
        password: "plain",
      });

      expect(result).toEqual(mockUser);
      expect(bcrypt.compare).toHaveBeenCalledWith("plain", mockUser.password);
    });

    it("throws UnauthorizedError if user not found", async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        userAuthService.signIn({ email: "x", password: "x" }),
      ).rejects.toThrow(UnauthorizedError);
    });

    it("throws UnauthorizedError if password does not match", async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        userAuthService.signIn({ email: mockUser.email, password: "wrong" }),
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  // ------------------------
  // emailAvailability()
  // ------------------------
  describe("emailAvailability()", () => {
    it("returns null if email not taken", async () => {
      jest.spyOn(userAuthService, "emailAvailability").mockResolvedValue(null);

      const result = await userAuthService.emailAvailability("new@example.com");
      expect(result).toBeNull();
    });

    it("throws ConflictError if email exists", async () => {
      jest
        .spyOn(userAuthService, "emailAvailability")
        .mockRejectedValue(new ConflictError("Email already in use"));

      await expect(
        userAuthService.emailAvailability("exists@example.com"),
      ).rejects.toThrow(ConflictError);
    });
  });
});
