import z from "zod";

export const historyResponseSchema = z.object({
  valid_id: z
    .instanceof(File, { message: "Valid ID is required" })
    .refine((file) => file.size > 0, "Valid ID is required")
    .optional(),
  security_deposit: z
    .instanceof(File, { message: "Security deposit proof is required" })
    .refine((file) => file.size > 0, "Security deposit proof is required")
    .optional(),
});

export type HistoryResponseSchema = z.infer<typeof historyResponseSchema>;
