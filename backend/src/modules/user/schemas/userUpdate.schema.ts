import { z } from "zod";
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  NAME_REGEX,
} from "../../../shared/constants/authFormValidation";

export const userUpdateSchema = z.object({
  first_name: z
    .string()
    .min(
      NAME_MIN_LENGTH,
      `First name must be at least ${NAME_MIN_LENGTH} characters`,
    )
    .max(
      NAME_MAX_LENGTH,
      `First name cannot exceed ${NAME_MAX_LENGTH} characters`,
    )
    .regex(NAME_REGEX, "First name can only contain letters and spaces")
    .optional(),
  last_name: z
    .string()
    .min(
      NAME_MIN_LENGTH,
      `Last name must be at least ${NAME_MIN_LENGTH} characters`,
    )
    .max(
      NAME_MAX_LENGTH,
      `Last name cannot exceed ${NAME_MAX_LENGTH} characters`,
    )
    .regex(NAME_REGEX, "Last name can only contain letters and spaces")
    .optional(),
  nationality: z
    .string()
    .min(1, "Nationality is required")
    .max(100, "Nationality cannot exceed 100 characters")
    .optional(),
});

export type UserUpdateDTO = z.infer<typeof userUpdateSchema>;
