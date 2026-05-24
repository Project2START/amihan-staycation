import z from "zod";
import {
  EMAIL_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
} from "../../../shared/constants/authFormValidation";

export const agentsSchema = z.object({
  email: z
    .email()
    .min(
      EMAIL_MIN_LENGTH,
      `Email must have a minimum ${EMAIL_MIN_LENGTH} characters length`,
    )
    .max(
      EMAIL_MAX_LENGTH,
      `Email exceeded ${EMAIL_MAX_LENGTH} max characters length`,
    ),
});

export type AgentsDTO = z.infer<typeof agentsSchema>;
