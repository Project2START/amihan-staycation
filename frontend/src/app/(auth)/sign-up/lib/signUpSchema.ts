import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  NAME_REGEX,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/app/shared/constants/authFormValidation";
import z from "zod";

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(NAME_MIN_LENGTH, `At least ${NAME_MIN_LENGTH} characters`)
      .max(NAME_MAX_LENGTH, `Exceeded ${NAME_MAX_LENGTH} characters`)
      .regex(NAME_REGEX, "Can only contain letters"),

    lastName: z
      .string()
      .min(NAME_MIN_LENGTH, `At least ${NAME_MIN_LENGTH} characters`)
      .max(NAME_MAX_LENGTH, `Exceeded ${NAME_MAX_LENGTH} characters`)
      .regex(NAME_REGEX, "Can only contain letters"),

    email: z
      .string()
      .nonempty("Email is required")
      .max(
        EMAIL_MAX_LENGTH,
        `Email cannot exceed ${EMAIL_MAX_LENGTH} characters`
      )
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
      )
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupSchema = z.infer<typeof signupSchema>;
