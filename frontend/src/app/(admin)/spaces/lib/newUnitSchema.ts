import z, { string } from "zod";

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;

export const PRICE_MAX = 1_000_000;

export const MAXPERSONS_MIN = 1;
export const MAXPERSONS_MAX = 4;

export const ABOUT_MAX = 1000;

export const PHOTOS_MIN = 3;

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
    .max(ABOUT_MAX, `Unit description exceeded ${NAME_MAX_LENGTH} characters`)
    .optional(),
  attributes: z.array(attributeSchema).optional(),
  // photos: z
  //   .array(z.instanceof(File))
  //   .min(PHOTOS_MIN, `Unit must have at least ${PHOTOS_MIN} photos`)
  //   .refine(
  //     (files) =>
  //       files.every((file) =>
  //         [
  //           "image/png",
  //           "image/jpeg",
  //           "image/jpg",
  //           "image/gif",
  //           "image/webp",
  //         ].includes(file.type),
  //       ),
  //     {
  //       message: "All files must be images (png, jpg, jpeg, gif, webp)",
  //     },
  //   ),
  photos: z
    .array(
      z.object({
        id: z.string(),
        photo: z.instanceof(File),
      }),
    )
    .min(PHOTOS_MIN, `Unit must have at least ${PHOTOS_MIN} photos`)
    .refine(
      (items) =>
        items.every((item) =>
          [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/gif",
            "image/webp",
          ].includes(item.photo.type),
        ),
      {
        message: "All files must be images (png, jpg, jpeg, gif, webp)",
      },
    ),
});

export type NewUnitSchema = z.infer<typeof newUnitSchema>;
