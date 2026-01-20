import z from "zod";
import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  NAME_REGEX,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "../../../shared/constants/authFormValidation";

export const registreeSchema = z.object({
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
    )
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type RegistreeDTO = z.infer<typeof registreeSchema>;
