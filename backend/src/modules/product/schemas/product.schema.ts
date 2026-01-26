import z from "zod";
import {
  NAME_MIN_LENGTH,
  ABOUT_MAX,
  MAXPERSONS_MAX,
  MAXPERSONS_MIN,
  NAME_MAX_LENGTH,
  PRICE_MAX,
  PHOTOS_MIN,
  ATTR_QUANTITY_MAX,
  ATTR_ID_MAX,
  ATTR_ID_MIN,
  ATTR_NAME_MAX,
  ATTR_NAME_MIN,
} from "../../../shared/constants/productFormValidation";

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
  quantity: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .number()
      .max(
        ATTR_QUANTITY_MAX,
        `Unit attribute quantity has exceeded ${ATTR_QUANTITY_MAX}`,
      ),
  ),
});

// const attributeSchema = z.object({
//   name: z.string(),
//   iconId: z.string(),
//   quantity: z.number(),
// });

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
  price: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .number()
      .positive("Unit price must be greater than 0")
      .max(PRICE_MAX, "Unit price cannot exceed 1 million"),
  ),
  maxPersons: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .number()
      .min(MAXPERSONS_MIN, `Unit must have at least ${MAXPERSONS_MIN} person`)
      .max(
        MAXPERSONS_MAX,
        `Unit capacity exceeded ${MAXPERSONS_MAX} max persons`,
      ),
  ),
  about: z
    .string()
    .max(ABOUT_MAX, `Unit description exceeded ${ABOUT_MAX} characters`)
    .optional(),

  attributes: z
    .preprocess(
      (val) => {
        // Parse JSON if it's a string (from multipart form)
        if (typeof val === "string") {
          try {
            return JSON.parse(val);
          } catch {
            return val; // let Zod catch invalid type
          }
        }
        return val;
      },
      z.array(newUnitAttributeSchema).max(100, `Unit attributes exceeded 100`),
    )
    .optional(),
  photos: z.preprocess(
    (val) => {
      // if you ever send the order index as JSON string array
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    },
    z.array(z.any()).min(1, `Unit must have at least ${PHOTOS_MIN} photos`),
  ),
});

export type ProductDTO = z.infer<typeof productSchema>;
