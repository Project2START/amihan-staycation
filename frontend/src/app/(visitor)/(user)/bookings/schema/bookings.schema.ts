import z from "zod";

export const USER_NAME_MIN = 2;
export const USER_NAME_MAX = 50;

export const AGE_MIN = 0;
export const AGE_MAX = 120;

export const NATIONALITY_MIN_LENGTH = 2;
export const NATIONALITY_MAX_LENGTH = 50;

export const CONTACT_NUMBER_MIN_LENGTH = 8;
export const CONTACT_NUMBER_MAX_LENGTH = 15;
export const CONTACT_NUMBER_CODE_MIN_LENGTH = 2;
export const CONTACT_NUMBER_CODE_MAX_LENGTH = 5;

const IMAGE_FILE_MIN_SIZE_BYTE = 1;
const IMAGE_FILE_MAX_SIZE_MB = 5;
const IMAGE_FILE_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

const POOL_ACCESS_MAX_DAYS = 183;

const ADDITIONAL_GUESTS_MAX = 10;

const PAYMENT_TYPE_MIN_LENGTH = 2;
const PAYMENT_TYPE_MAX_LENGTH = 50;

const STATUS_MIN_LENGTH = 2;
const STATUS_MAX_LENGTH = 20;

export const URL_MIN_LENGTH = 5;
export const URL_MAX_LENGTH = 2048;

const STANDARD_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const photoFileSchema = z.object({
  file: z
    .file("Valid photo is required.")
    .min(IMAGE_FILE_MIN_SIZE_BYTE, "File must not be empty.")
    .max(IMAGE_FILE_MAX_SIZE_MB * 1024 * 1024, "File size must not exceed 5MB.")
    .mime(IMAGE_FILE_ALLOWED_TYPES, {
      error: "Only JPG, PNG, or GIF files are allowed.",
    })
    .optional(),
  url: z
    .string("URL is required")
    .min(URL_MIN_LENGTH, `URL must be at least ${URL_MIN_LENGTH} characters.`)
    .max(URL_MAX_LENGTH, `URL must not exceed ${URL_MAX_LENGTH} characters.`),
  id: z.uuid("Invalid photo id"),
});

const contactNumberSchema = z.object({
  countryCode: z
    .string("Country code is required")
    .min(CONTACT_NUMBER_CODE_MIN_LENGTH, "Country code is too short.")
    .max(CONTACT_NUMBER_CODE_MAX_LENGTH, "Country code is too long."),
  callingCode: z
    .string("Calling code is required")
    .min(CONTACT_NUMBER_CODE_MIN_LENGTH, "Calling code is too short.")
    .max(CONTACT_NUMBER_CODE_MAX_LENGTH, "Calling code is too long."),
  number: z
    .string("Contact number is required.")
    .min(1, "Contact number is required.")
    .min(CONTACT_NUMBER_MIN_LENGTH, "Contact number is too short.")
    .max(CONTACT_NUMBER_MAX_LENGTH, "Contact number is too long."),
});

const poolAccessSchema = z.object({
  hasAccess: z.boolean("Please specify pool access."),
  access: z
    .array(
      z.object({
        date: z
          .string()
          .regex(
            STANDARD_DATE_PATTERN,
            "Check-in date must be in YYYY-MM-DD format",
          ),
        am: z.boolean("Please specify AM access.").nullable(),
        pm: z.boolean("Please specify PM access.").nullable(),
      }),
      "Invalid pool access data.",
    )
    .max(POOL_ACCESS_MAX_DAYS, "Pool access days exceed allowed limit.")
    .optional(),
});

export const additionalGuestsSchema = z
  .object({
    name: z
      .string("Additional guest name is required.")
      .min(
        USER_NAME_MIN,
        "Additional guest name must be at least 2 characters.",
      )
      .max(
        USER_NAME_MAX,
        "Additional guest name must not exceed 50 characters.",
      ),
    age: z
      .number("Additional guest age is required.")
      .min(AGE_MIN, "Age cannot be negative.")
      .max(AGE_MAX, "Please enter a valid age.")
      .max(AGE_MAX, "Please enter a valid age.")
      .optional(),
    below_three_feet: z.boolean("Please indicate height requirement."),
    valid_id: photoFileSchema.optional(),
    pool_access: poolAccessSchema.optional(),
    with_vehicle: z.boolean("Please specify vehicle information."),
  })
  .superRefine((data, ctx) => {
    if (
      !data.below_three_feet &&
      (!data.valid_id || !data.valid_id.file || !data.valid_id.url)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Valid ID is required.",
        path: ["valid_id"],
      });
    }
  });

const checkPeriodSchema = z
  .object({
    check_in: z
      .string()
      .regex(
        STANDARD_DATE_PATTERN,
        "Check-in date must be in YYYY-MM-DD format",
      ),

    check_out: z
      .string()
      .regex(
        STANDARD_DATE_PATTERN,
        "Check-out date must be in YYYY-MM-DD format",
      ),
  })
  .refine((data) => data.check_in < data.check_out, {
    message: "Check-out date must be after check-in date",
    path: ["check_out"],
  });

export const bookingSchema = z.object({
  check_period: checkPeriodSchema,
  name: z
    .string("Name is required.")
    .min(USER_NAME_MIN, "Name must be at least 2 characters.")
    .max(USER_NAME_MAX, "Name must not exceed 50 characters."),
  age: z
    .number("Age is required.")
    .min(AGE_MIN, "Age cannot be negative.")
    .max(AGE_MAX, "Please enter a valid age."),
  nationality: z
    .string("Nationality is required.")
    .min(NATIONALITY_MIN_LENGTH, "Nationality must be at least 2 characters.")
    .max(NATIONALITY_MAX_LENGTH, "Nationality must not exceed 50 characters."),
  contact_number: z
    .string("Contact number is required.")
    .min(1, "Contact number is required.")
    .min(CONTACT_NUMBER_MIN_LENGTH, "Contact number is too short.")
    .max(CONTACT_NUMBER_MAX_LENGTH, "Contact number is too long."),
  valid_id: photoFileSchema,
  pool_access: poolAccessSchema,
  // z.object({
  //   hasAccess: z.boolean("Please specify pool access."),
  //   access: z
  //     .array(poolAccessSchema, "Invalid pool access data.")
  //     .max(POOL_ACCESS_MAX_DAYS, "Pool access days exceed allowed limit.")
  //     .optional(),
  // }),
  with_vehicle: z.boolean("Please specify vehicle information."),
  additional_guests: z
    .array(additionalGuestsSchema, "Invalid additional guest data.")
    .max(
      ADDITIONAL_GUESTS_MAX,
      "You have exceeded the maximum number of additional guests.",
    ),
  payment_type: z
    .string("Payment type is required.")
    .min(PAYMENT_TYPE_MIN_LENGTH, "Payment type is too short.")
    .max(PAYMENT_TYPE_MAX_LENGTH, "Payment type is too long."),
  payment_proof: photoFileSchema,
  agree_terms: z.boolean(),
  user_id: z.uuid("Invalid user ID."),
  product_id: z.uuid("Invalid product ID."),
  status: z
    .string("Status is required.")
    .min(STATUS_MIN_LENGTH, "Status cannot be empty.")
    .max(STATUS_MAX_LENGTH, "Status is too long."),
});

export type BookingSchema = z.infer<typeof bookingSchema>;
export type BookingPhotoFileSchema = z.infer<typeof photoFileSchema>;
export type BookingAdditionalGuestsSchema = z.infer<
  typeof additionalGuestsSchema
>;
// import z from "zod";

// export const USER_NAME_MIN = 2; // Minimum 2 characters (e.g., "Al")
// export const USER_NAME_MAX = 50;

// export const AGE_MIN = 0;
// export const AGE_MAX = 120;

// export const NATIONALITY_MIN_LENGTH = 2;
// export const NATIONALITY_MAX_LENGTH = 50;

// export const CONTACT_NUMBER_MIN_LENGTH = 7;
// export const CONTACT_NUMBER_MAX_LENGTH = 15;

// const IMAGE_FILE_MIN_SIZE_BYTE = 1;
// const IMAGE_FILE_MAX_SIZE_MB = 5;
// const IMAGE_FILE_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

// const POOL_ACCESS_MAX_DAYS = 183;

// const ADDITIONAL_GUESTS_MAX = 10;

// const PAYMENT_TYPE_MIN_LENGTH = 2;
// const PAYMENT_TYPE_MAX_LENGTH = 50;

// export const STATUS_MIN_LENGTH = 1;
// export const STATUS_MAX_LENGTH = 20;

// const poolAccessSchema = z.object({
//   date: z.date(),
//   am: z.boolean(),
//   pm: z.boolean(),
// });

// const additionalGuestsSchema = z.object({
//   name: z.string("").min(USER_NAME_MIN, ``).max(USER_NAME_MAX, ``),
//   age: z.number("").min(AGE_MIN, ``).max(AGE_MAX, ``),
//   below_three_feet: z.boolean(""),
//   valid_id: z
//     .file("")
//     .min(IMAGE_FILE_MIN_SIZE_BYTE, ``)
//     .max(IMAGE_FILE_MAX_SIZE_MB * 1024 * 1024, ``)
//     .mime(IMAGE_FILE_ALLOWED_TYPES, { error: `` }),
//   pool_access: z
//     .array(poolAccessSchema, "")
//     .max(POOL_ACCESS_MAX_DAYS, ``)
//     .optional(),
//   with_vehicle: z.boolean(""),
// });

// export const bookingSchema = z.object({
//   check_in: z.date(""),
//   check_out: z.date(""),
//   name: z.string("").min(USER_NAME_MIN, ``).max(USER_NAME_MAX, ``),
//   age: z.number("").min(AGE_MIN, ``).max(AGE_MAX, ``),
//   nationality: z
//     .string("")
//     .min(NATIONALITY_MIN_LENGTH, ``)
//     .max(NATIONALITY_MAX_LENGTH, ``),
//   contact_number: z
//     .string("")
//     .min(CONTACT_NUMBER_MIN_LENGTH, ``)
//     .max(CONTACT_NUMBER_MAX_LENGTH, ``),
//   valid_id: z
//     .file("")
//     .min(IMAGE_FILE_MIN_SIZE_BYTE, ``)
//     .max(IMAGE_FILE_MAX_SIZE_MB * 1024 * 1024)
//     .mime(IMAGE_FILE_ALLOWED_TYPES, { error: `` }),
//   pool_access: z
//     .array(poolAccessSchema, "")
//     .max(POOL_ACCESS_MAX_DAYS, ``)
//     .optional(),
//   with_vehicle: z.boolean(""),
//   additional_guests: z
//     .array(additionalGuestsSchema, "")
//     .max(ADDITIONAL_GUESTS_MAX, ``),
//   payment_type: z
//     .string("")
//     .min(PAYMENT_TYPE_MIN_LENGTH, ``)
//     .max(PAYMENT_TYPE_MAX_LENGTH, ``),
//   payment_proof: z
//     .file("")
//     .min(IMAGE_FILE_MIN_SIZE_BYTE, ``)
//     .max(IMAGE_FILE_MAX_SIZE_MB * 1024 * 1024)
//     .mime(IMAGE_FILE_ALLOWED_TYPES, { error: `` }),
//   agree_terms: z.boolean(),
//   user_id: z.uuid(""),
//   product_id: z.uuid(""),
//   status: z.string("").min(STATUS_MIN_LENGTH, ``).max(STATUS_MAX_LENGTH, ``),
// });
