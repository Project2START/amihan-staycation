import crypto from "crypto";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../../../shared/helpers/appErrors";
import { userRepository } from "../../user/repositories/user.repository";
import { sendPasswordResetEmail } from "../../user/helpers/sendPasswordResetEmail";

const prisma = new PrismaClient();

const GENERIC_RESET_MESSAGE =
  "If an account exists, a reset link has been sent.";

const RESET_TTL_MINUTES = 30;
const RATE_LIMIT_MAX_REQUESTS = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const hashValue = (value: string) =>
  // SEC: Hash reset tokens before persistence so plaintext tokens are never stored.
  crypto.createHash("sha256").update(value).digest("hex");

const getWindowState = (windowStart: Date, now: Date) => {
  const isWindowExpired =
    now.getTime() - windowStart.getTime() > RATE_LIMIT_WINDOW_MS;
  return {
    isWindowExpired,
    nextWindowStart: isWindowExpired ? now : windowStart,
  };
};

class PasswordResetService {
  async requestPasswordReset(
    email: string,
    ipAddress: string,
    source: "auth" | "profile",
  ) {
    const user = await userRepository.findByEmail(email);

    // SEC: Return the same response regardless of account existence to prevent account enumeration.
    if (!user) {
      console.info("password_reset_requested", {
        at: new Date().toISOString(),
        ipAddress,
        hasAccount: false,
      });
      return { message: GENERIC_RESET_MESSAGE };
    }

    const now = new Date();
    const existing = await prisma.passwordResetToken.findUnique({
      where: { userId: user.id },
    });

    if (existing) {
      const { isWindowExpired, nextWindowStart } = getWindowState(
        existing.requestWindowStart,
        now,
      );

      const currentCount = isWindowExpired ? 0 : existing.requestCount;

      // SEC: Enforce per-email reset request rate limiting.
      if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
        return { message: GENERIC_RESET_MESSAGE };
      }

      // SEC: Generate a cryptographically secure random reset token.
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashValue(rawToken);

      await prisma.passwordResetToken.update({
        where: { userId: user.id },
        data: {
          // SEC: Replace token hash and expiry on each request to invalidate previous links.
          tokenHash,
          // SEC: Enforce strict token expiration on the server.
          expiresAt: new Date(now.getTime() + RESET_TTL_MINUTES * 60 * 1000),
          // SEC: Reset single-use marker when creating a fresh token.
          usedAt: null,
          requestCount: currentCount + 1,
          requestWindowStart: nextWindowStart,
        },
      });

      const resetLink = `${process.env.FRONTEND_HOST}/reset-password?token=${encodeURIComponent(rawToken)}&source=${encodeURIComponent(source)}`;

      await sendPasswordResetEmail({
        email: user.email,
        resetLink,
        expiresInMinutes: RESET_TTL_MINUTES,
      });

      console.info("password_reset_requested", {
        at: new Date().toISOString(),
        ipAddress,
        hasAccount: true,
      });

      return { message: GENERIC_RESET_MESSAGE };
    }

    // SEC: Generate a cryptographically secure random reset token.
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashValue(rawToken);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        // SEC: Store only token hash, never plaintext token.
        tokenHash,
        // SEC: Enforce strict token expiration on the server.
        expiresAt: new Date(now.getTime() + RESET_TTL_MINUTES * 60 * 1000),
        requestCount: 1,
        requestWindowStart: now,
      },
    });

    const resetLink = `${process.env.FRONTEND_HOST}/reset-password?token=${encodeURIComponent(rawToken)}&source=${encodeURIComponent(source)}`;

    await sendPasswordResetEmail({
      email: user.email,
      resetLink,
      expiresInMinutes: RESET_TTL_MINUTES,
    });

    console.info("password_reset_requested", {
      at: new Date().toISOString(),
      ipAddress,
      hasAccount: true,
    });

    return { message: GENERIC_RESET_MESSAGE };
  }

  async validateResetToken(token: string) {
    const tokenHash = hashValue(token);

    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: { tokenHash },
    });

    if (
      !resetRecord ||
      resetRecord.usedAt ||
      resetRecord.expiresAt < new Date()
    ) {
      throw new BadRequestError("Invalid or expired reset token.");
    }

    return { message: "Token is valid." };
  }

  async resetPassword({
    token,
    password,
    source,
    ipAddress,
  }: {
    token: string;
    password: string;
    source: "auth" | "profile";
    ipAddress: string;
  }) {
    const tokenHash = hashValue(token);

    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: { tokenHash },
      include: { user: true },
    });

    // SEC: Reject invalid, used, or expired token on the server.
    if (
      !resetRecord ||
      resetRecord.usedAt ||
      resetRecord.expiresAt < new Date()
    ) {
      throw new BadRequestError("Invalid or expired reset token.");
    }

    // SEC: Hash password before storing it.
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      await tx.users.update({
        where: { id: resetRecord.userId },
        data: {
          password: hashedPassword,
          // SEC: Revoke existing sessions only for unauthenticated reset flow.
          auth_version:
            source === "auth"
              ? resetRecord.user.auth_version + 1
              : resetRecord.user.auth_version,
        },
      });

      await tx.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: {
          // SEC: Mark token as used immediately to enforce single-use behavior.
          usedAt: new Date(),
        },
      });
    });

    console.info("password_reset_completed", {
      at: new Date().toISOString(),
      ipAddress,
      source,
    });

    return { message: "Password updated successfully." };
  }
}

export const passwordResetService = new PasswordResetService();
