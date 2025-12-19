import z from "zod";

export const registreeVerifySchema = z.object({
  id: z.string().nonempty().uuid("Invalid ID format"),
});

export type RegistreeVerifyDTO = z.infer<typeof registreeVerifySchema>;
