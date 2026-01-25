import z from "zod";
import {
  NAME_MIN_LENGTH,
  ABOUT_MAX,
  MAXPERSONS_MAX,
  MAXPERSONS_MIN,
  NAME_MAX_LENGTH,
  PHOTOS_MAX,
  PHOTOS_MIN,
  PRICE_MAX,
} from "../../../shared/constants/productFormValidation";

const attributeSchema = z.object({
  name: z.string(),
  iconId: z.string(),
  quantity: z.number(),
});

export const productSchema = z.object({
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
  attributes: z.array(attributeSchema).optional(),

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

export type ProductDTO = z.infer<typeof productSchema>;
