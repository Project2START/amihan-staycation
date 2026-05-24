import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/app/shared/constants/authFormValidation";
import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .max(EMAIL_MAX_LENGTH, "Invalid email address")
    .email("Invalid email address"),
  password: z
    .string()
    .nonempty("Password is required")
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
