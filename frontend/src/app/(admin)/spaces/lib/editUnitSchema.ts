import z from "zod";
import { newUnitSchema } from "./newUnitSchema";
import { UUID_MAX } from "@/app/shared/constants/productFormValidation";

export const editUnitSchema = newUnitSchema.extend({
  deletedPhotos: z
    .array(
      z.string().max(UUID_MAX, `ID must be at most ${UUID_MAX} characters`),
    )
    .optional(),
});

export type EditUnitSchema = z.infer<typeof editUnitSchema>;
