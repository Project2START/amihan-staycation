import z from "zod";

export const ACCOUNT_NAME_MIN = 2;
export const ACCOUNT_NAME_MAX = 100;
export const ACCOUNT_NUMBER_MIN = 5;
export const ACCOUNT_NUMBER_MAX = 30;
export const PAYMENT_METHOD_MIN = 2;
export const PAYMENT_METHOD_MAX = 50;

const IMAGE_FILE_MIN_SIZE_BYTE = 1;
const IMAGE_FILE_MAX_SIZE_MB = 5;
const IMAGE_FILE_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];
export const URL_MIN_LENGTH = 5;
export const URL_MAX_LENGTH = 2048;

const qrCodePhotoSchema = z.object({
  file: z
    .file("Valid QR code image is required.")
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

export const addPaymentMethodSchema = z.object({
  payment_method: z
    .string("Payment method is required.")
    .min(
      PAYMENT_METHOD_MIN,
      `Payment method must be at least ${PAYMENT_METHOD_MIN} characters.`,
    )
    .max(
      PAYMENT_METHOD_MAX,
      `Payment method must not exceed ${PAYMENT_METHOD_MAX} characters.`,
    ),
  qr_code: z
    .union([qrCodePhotoSchema, z.undefined()])
    .refine((val) => val !== undefined, {
      message: "QR code image is required.",
    }),
  account_name: z
    .string("Account name is required.")
    .min(
      ACCOUNT_NAME_MIN,
      `Account name must be at least ${ACCOUNT_NAME_MIN} characters.`,
    )
    .max(
      ACCOUNT_NAME_MAX,
      `Account name must not exceed ${ACCOUNT_NAME_MAX} characters.`,
    ),
  account_number: z
    .string("Account number is required.")
    .min(
      ACCOUNT_NUMBER_MIN,
      `Account number must be at least ${ACCOUNT_NUMBER_MIN} characters.`,
    )
    .max(
      ACCOUNT_NUMBER_MAX,
      `Account number must not exceed ${ACCOUNT_NUMBER_MAX} characters.`,
    ),
});

export type AddPaymentMethodSchema = z.infer<typeof addPaymentMethodSchema>;
export type QrCodePhotoSchema = z.infer<typeof qrCodePhotoSchema>;
