import {
  ABOUT_MAX,
  ATTR_ID_MAX,
  ATTR_ID_MIN,
  ATTR_NAME_MAX,
  ATTR_NAME_MIN,
  ATTR_QUANTITY_MAX,
  MAXPERSONS_MAX,
  MAXPERSONS_MIN,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PHOTOS_MAX,
  PHOTOS_MIN,
  PRICE_MAX,
} from "@/app/shared/constants/productFormValidation";
import z from "zod";

export const newUnitAttributeSchema = z.object({
  name: z
    .string()
    .min(
      ATTR_NAME_MIN,
      `Unit attribute name must have at least ${ATTR_NAME_MIN} characters`,
    )
    .max(
      ATTR_NAME_MAX,
      `Unit attribute name has exceeded ${ATTR_NAME_MAX} characters`,
    ),
  iconId: z
    .string()
    .min(
      ATTR_ID_MIN,
      `Unit attribute id must have at least ${ATTR_ID_MIN} characters`,
    )
    .max(
      ATTR_ID_MAX,
      `Unit attribute id has exceeded ${ATTR_ID_MAX} characters`,
    ),
  quantity: z
    .number()
    .max(
      ATTR_QUANTITY_MAX,
      `Unit attribute quantity has exceeded ${ATTR_QUANTITY_MAX}`,
    ),
});

export const newUnitSchema = z.object({
  name: z
    .string()
    .min(
      NAME_MIN_LENGTH,
      `Unit name must have at least ${NAME_MIN_LENGTH} characters`,
    )
    .max(
      NAME_MAX_LENGTH,
      `Unit name has exceeded ${NAME_MAX_LENGTH} characters`,
    ),
  price: z
    .number("Invalid unit price")
    .positive("Unit price must be greater than 0")
    .max(PRICE_MAX, "Unit price cannot exceed 1 million"),
  maxPersons: z
    .number("Invalid unit max persons")
    .min(MAXPERSONS_MIN, `Unit must have at least ${MAXPERSONS_MIN} person`)
    .max(
      MAXPERSONS_MAX,
      `Unit capacity exceeded ${MAXPERSONS_MAX} max persons`,
    ),
  about: z
    .string()
    .max(ABOUT_MAX, `Unit description exceeded ${ABOUT_MAX} characters`)
    .optional(),
  attributes: z.array(newUnitAttributeSchema).optional(),

  photos: z
    .array(
      z.object({
        file: z.instanceof(File),
        id: z.string(),
        src: z.string(),
      }),
    )
    .min(PHOTOS_MIN, `Unit must have at least ${PHOTOS_MIN} photos`)
    .max(PHOTOS_MAX, `Unit exceeded ${PHOTOS_MAX} max photos`),
});

export type NewUnitSchema = z.infer<typeof newUnitSchema>;
export type NewUnitAttributeSchema = z.infer<typeof newUnitAttributeSchema>;
