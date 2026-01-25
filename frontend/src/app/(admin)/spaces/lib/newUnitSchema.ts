import z, { string } from "zod";

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;

export const PRICE_MAX = 1_000_000;

export const MAXPERSONS_MIN = 1;
export const MAXPERSONS_MAX = 4;

export const ABOUT_MAX = 1000;

export const PHOTOS_MIN = 3;
export const PHOTOS_MAX = 25;

const attributeSchema = z.object({
  name: z.string(),
  iconId: z.string(),
  quantity: z.number(),
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

export type NewUnitSchema = z.infer<typeof newUnitSchema>;
