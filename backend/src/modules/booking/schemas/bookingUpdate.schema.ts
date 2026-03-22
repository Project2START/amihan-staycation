import z from "zod";
import { STATUS_MAX_LENGTH, STATUS_MIN_LENGTH } from "./booking.schema";
import { ABOUT_MAX } from "../../../shared/constants/productFormValidation";

export const bookingUpdateSchema = z
  .object({
    status: z
      .string()
      .min(STATUS_MIN_LENGTH, "Status cannot be empty.")
      .max(STATUS_MAX_LENGTH, "Status is too long."),
    status_message: z
      .string()
      .max(ABOUT_MAX, `Status message exceeded ${ABOUT_MAX} characters`),
    action_items: z
      .array(z.string())
      .max(100, `Action items exceeded 100 items`),
  })
  .partial();

export type BookingUpdateDTO = z.infer<typeof bookingUpdateSchema>;

// message,
// valid_id,
// payment_proof,
// action_items,
// bookingId,
// hasUserResponded

// USER

// The last item of the message was to be seen (if hasUseResponded is false)
// They can upload the required action items that admin or owner asks in history page
// When hasUserResponded is true, they won't be able to submit anything but can see the history
// If hasUserResponded is true display a message saying "Thank you for responding. We will let you know once review has been done"
// If false go back to the first item of this list
// Once submitted change booking to status pending

// ADMIN

// They can just review it and decide if accepted or not
// Can view history
// When they want customer to send again something, they can just do it on the booking summary and using action required again
// Once action required has been chosen change booking status to action required
