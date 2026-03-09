import z from "zod";
import { UUID_MAX } from "../../../shared/constants/productFormValidation";

// NOTIFICATION UPDATE SCHEMA

export const notificationUpdateIdentifier = z.object({
  userDestinationId: z
    .string()
    .min(1, "User destination ID is required")
    .max(
      UUID_MAX,
      `User destination ID must be at most ${UUID_MAX} characters.`,
    ),
});

export const notificationUpdateData = z.object({
  hasRead: z.boolean(),
});

export const notificationUpdateSchema = z.object({
  identifier: notificationUpdateIdentifier,
  data: notificationUpdateData,
});

// DTO Types inferred from Zod schemas
export type NotificationUpdateIdentifierDTO = z.infer<
  typeof notificationUpdateIdentifier
>;
export type NotificationUpdateDataDTO = z.infer<typeof notificationUpdateData>;
export type NotificationUpdateDTO = z.infer<typeof notificationUpdateSchema>;
