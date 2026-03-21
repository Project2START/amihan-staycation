import { z } from "zod";
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../../../shared/constants/authFormValidation";

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .nonempty()
    .max(EMAIL_MAX_LENGTH, `Email cannot exceed ${EMAIL_MAX_LENGTH} characters`)
    .email("Invalid email address"),
  source: z.enum(["auth", "profile"]).optional(),
});

export const passwordResetValidateTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const passwordResetCompleteSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
      )
      .max(
        PASSWORD_MAX_LENGTH,
        `Password cannot exceed ${PASSWORD_MAX_LENGTH} characters`,
      ),
    confirmPassword: z.string(),
    source: z.enum(["auth", "profile"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordResetRequestDTO = z.infer<
  typeof passwordResetRequestSchema
>;
export type PasswordResetValidateTokenDTO = z.infer<
  typeof passwordResetValidateTokenSchema
>;
export type PasswordResetCompleteDTO = z.infer<
  typeof passwordResetCompleteSchema
>;
