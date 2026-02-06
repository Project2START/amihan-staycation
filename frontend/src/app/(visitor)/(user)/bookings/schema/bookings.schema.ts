import z from "zod";

export const USER_NAME_MIN = 2; // Minimum 2 characters (e.g., "Al")
export const USER_NAME_MAX = 50;

export const AGE_MIN = 0;
export const AGE_MAX = 120;

export const NATIONALITY_MIN_LENGTH = 2;
export const NATIONALITY_MAX_LENGTH = 50;

export const CONTACT_NUMBER_MIN_LENGTH = 7;
export const CONTACT_NUMBER_MAX_LENGTH = 15;

const IMAGE_FILE_MIN_SIZE_BYTE = 1;
const IMAGE_FILE_MAX_SIZE_MB = 5;
const IMAGE_FILE_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

const POOL_ACCESS_MAX_DAYS = 183;

const ADDITIONAL_GUESTS_MAX = 10;

const PAYMENT_TYPE_MIN_LENGTH = 2;
const PAYMENT_TYPE_MAX_LENGTH = 50;

export const UUID_MIN_LENGTH = 36;
export const UUID_MAX_LENGTH = 36;

export const STATUS_MIN_LENGTH = 1;
export const STATUS_MAX_LENGTH = 20;

const poolAccessSchema = z.object({
  date: z.date(),
  am: z.boolean(),
  pm: z.boolean(),
});

const additionalGuestsSchema = z.object({
  name: z.string("").min(USER_NAME_MIN, ``).max(USER_NAME_MAX, ``),
  age: z.number("").min(AGE_MIN, ``).max(AGE_MAX, ``),
  below_three_feet: z.boolean(""),
  valid_id: z
    .file("")
    .min(IMAGE_FILE_MIN_SIZE_BYTE, ``)
    .max(IMAGE_FILE_MAX_SIZE_MB * 1024 * 1024, ``)
    .mime(IMAGE_FILE_ALLOWED_TYPES, { error: `` }),
  pool_access: z
    .array(poolAccessSchema, "")
    .max(POOL_ACCESS_MAX_DAYS, ``)
    .optional(),
  with_vehicle: z.boolean(""),
});

export const bookingSchema = z.object({
  check_in: z.date(""),
  check_out: z.date(""),
  name: z.string("").min(USER_NAME_MIN, ``).max(USER_NAME_MAX, ``),
  age: z.number("").min(AGE_MIN, ``).max(AGE_MAX, ``),
  nationality: z
    .string("")
    .min(NATIONALITY_MIN_LENGTH, ``)
    .max(NATIONALITY_MAX_LENGTH, ``),
  contact_number: z
    .string("")
    .min(CONTACT_NUMBER_MIN_LENGTH, ``)
    .max(CONTACT_NUMBER_MAX_LENGTH, ``),
  valid_id: z
    .file("")
    .min(IMAGE_FILE_MIN_SIZE_BYTE, ``)
    .max(IMAGE_FILE_MAX_SIZE_MB * 1024 * 1024)
    .mime(IMAGE_FILE_ALLOWED_TYPES, { error: `` }),
  pool_access: z
    .array(poolAccessSchema, "")
    .max(POOL_ACCESS_MAX_DAYS, ``)
    .optional(),
  with_vehicle: z.boolean(""),
  additional_guests: z
    .array(additionalGuestsSchema, "")
    .max(ADDITIONAL_GUESTS_MAX, ``),
  payment_type: z
    .string("")
    .min(PAYMENT_TYPE_MIN_LENGTH, ``)
    .max(PAYMENT_TYPE_MAX_LENGTH, ``),
  payment_proof: z
    .file("")
    .min(IMAGE_FILE_MIN_SIZE_BYTE, ``)
    .max(IMAGE_FILE_MAX_SIZE_MB * 1024 * 1024)
    .mime(IMAGE_FILE_ALLOWED_TYPES, { error: `` }),
  agree_terms: z.boolean(),
  user_id: z.string("").min(UUID_MIN_LENGTH, ``).max(UUID_MAX_LENGTH, ``),
  product_id: z.string("").min(UUID_MIN_LENGTH, ``).max(UUID_MAX_LENGTH, ``),
  status: z.string("").min(STATUS_MIN_LENGTH, ``).max(STATUS_MAX_LENGTH, ``),
});
