import { z } from "zod";
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../../../shared/constants/authFormValidation";

export const userSignUpSchema = z.object({
  id: z.string().nonempty().uuid("Invalid ID format"),
  verificationCode: z
    .string()
    .nonempty("Verification code is required")
    .regex(/^\d{6}$/, "Verification code must be exactly 6 digits"),
});

export const userSignInSchema = z.object({
  email: z
    .string()
    .nonempty()
    .max(EMAIL_MAX_LENGTH, `Email cannot exceed ${EMAIL_MAX_LENGTH} characters`)
    .email("Invalid email address"),
  password: z
    .string()
    .min(
      PASSWORD_MIN_LENGTH,
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
    )
    .max(
      PASSWORD_MAX_LENGTH,
      `Password cannot exceed ${PASSWORD_MAX_LENGTH} characters`
    ),
});

export type UserSignUpDTO = z.infer<typeof userSignUpSchema>;
export type UserSignInDTO = z.infer<typeof userSignInSchema>;
