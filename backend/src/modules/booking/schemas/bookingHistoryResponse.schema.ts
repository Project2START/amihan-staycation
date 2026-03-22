import z from "zod";

export const bookingHistoryResponseSchema = z
  .object({
    historyId: z.string().uuid("Invalid history ID"),
  })
  .passthrough();

export type BookingHistoryResponseDTO = z.infer<
  typeof bookingHistoryResponseSchema
> & {
  [key: string]: any;
};
