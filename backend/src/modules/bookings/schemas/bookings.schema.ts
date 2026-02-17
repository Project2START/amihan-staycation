import z from "zod";
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  AGE_MIN,
  AGE_MAX,
  CONTACT_MIN_LENGTH,
  CONTACT_MAX_LENGTH,
  NATIONALITY_MAX_LENGTH,
} from "../../../shared/constants/bookingFormValidation";

export const bookingSchema = z.object({
  checkInDate: z
    .string()
    .min(1, "Check-in date is required"),

  checkOutDate: z
    .string()
    .min(1, "Check-out date is required"),

  guestName: z
    .string()
    .min(
      NAME_MIN_LENGTH,
      `Guest name must have at least ${NAME_MIN_LENGTH} characters`,
    )
    .max(
      NAME_MAX_LENGTH,
      `Guest name has exceeded ${NAME_MAX_LENGTH} characters`,
    ),

  age: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .number()
      .min(AGE_MIN, "Age cannot be negative")
      .max(AGE_MAX, `Age cannot exceed ${AGE_MAX}`),
  ),

  nationality: z
    .string()
    .min(1, "Nationality is required")
    .max(
      NATIONALITY_MAX_LENGTH,
      `Nationality exceeded ${NATIONALITY_MAX_LENGTH} characters`,
    ),

  contactNumber: z
    .string()
    .min(
      CONTACT_MIN_LENGTH,
      `Contact number must have at least ${CONTACT_MIN_LENGTH} digits`,
    )
    .max(
      CONTACT_MAX_LENGTH,
      `Contact number exceeded ${CONTACT_MAX_LENGTH} digits`,
    ),

  poolAccess: z.boolean(),
})
 .refine(
    (data) => new Date(data.checkOutDate) > new Date(data.checkInDate),
    {
      message: "Check-out date must be after check-in date",
      path: ["checkOutDate"], // shows error under check-out field
    },
  );

export type BookingDTO = z.infer<typeof bookingSchema>;

