import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/app/shared/constants/authFormValidation";
import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(EMAIL_MIN_LENGTH, `Email is too short`)
    .max(EMAIL_MAX_LENGTH, `Email is too long`)
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

export type SignInSchema = z.infer<typeof signInSchema>;
