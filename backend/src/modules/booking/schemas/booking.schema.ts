import z from "zod";

// Booking form validation constants (aligned with frontend)
export const USER_NAME_MIN = 2;
export const USER_NAME_MAX = 50;
export const AGE_MIN = 0;
export const AGE_MAX = 120;
export const NATIONALITY_MIN_LENGTH = 2;
export const NATIONALITY_MAX_LENGTH = 50;
export const CONTACT_NUMBER_MIN_LENGTH = 8;
export const CONTACT_NUMBER_MAX_LENGTH = 15;
export const ADDITIONAL_GUESTS_MAX = 10;
export const PAYMENT_TYPE_MIN_LENGTH = 2;
export const PAYMENT_TYPE_MAX_LENGTH = 50;
export const STATUS_MIN_LENGTH = 2;
export const STATUS_MAX_LENGTH = 20;
export const STANDARD_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const POOL_ACCESS_MAX_DAYS = 183;
export const UUID_MAX = 36;

export const additionalGuestSchema = z.object({
  name: z
    .string()
    .min(
      USER_NAME_MIN,
      `Additional guest name must be at least ${USER_NAME_MIN} characters.`,
    )
    .max(
      USER_NAME_MAX,
      `Additional guest name must not exceed ${USER_NAME_MAX} characters.`,
    ),
  age: z.preprocess(
    (val) =>
      val === undefined || val === null || val === ""
        ? undefined
        : typeof val === "string"
          ? Number(val)
          : val,
    z
      .number()
      .min(AGE_MIN, "Age cannot be negative.")
      .max(AGE_MAX, "Please enter a valid age.")
      .optional(),
  ),
  below_three_feet: z.preprocess((val) => {
    if (typeof val === "string") {
      if (val === "true") return true;
      if (val === "false") return false;
    }
    return val;
  }, z.boolean()),
  pool_access: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return undefined;
        }
      }
      return val;
    },
    z
      .object({
        hasAccess: z.preprocess((val) => {
          if (typeof val === "string") {
            if (val === "true") return true;
            if (val === "false") return false;
          }
          return val;
        }, z.boolean()),
        access: z
          .array(
            z.object({
              date: z
                .string()
                .regex(
                  STANDARD_DATE_PATTERN,
                  "Date must be in YYYY-MM-DD format",
                ),
              am: z.preprocess(
                (val) =>
                  val === null || val === undefined
                    ? null
                    : typeof val === "string"
                      ? val === "true"
                        ? true
                        : val === "false"
                          ? false
                          : null
                      : val,
                z.boolean().nullable(),
              ),
              pm: z.preprocess(
                (val) =>
                  val === null || val === undefined
                    ? null
                    : typeof val === "string"
                      ? val === "true"
                        ? true
                        : val === "false"
                          ? false
                          : null
                      : val,
                z.boolean().nullable(),
              ),
            }),
          )
          .min(
            0,
            "You must provide an array for pool access days (can be empty if none).",
          )
          .max(POOL_ACCESS_MAX_DAYS, `Pool access days exceed allowed limit.`)
          .optional(),
      })
      .optional(),
  ),
  with_vehicle: z.preprocess((val) => {
    if (typeof val === "string") {
      if (val === "true") return true;
      if (val === "false") return false;
    }
    return val;
  }, z.boolean()),
});

export const checkPeriodSchema = z
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
  check_period: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return val;
  }, checkPeriodSchema),
  name: z
    .string()
    .min(USER_NAME_MIN, `Name must be at least ${USER_NAME_MIN} characters.`)
    .max(USER_NAME_MAX, `Name must not exceed ${USER_NAME_MAX} characters.`),
  age: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .number()
      .min(AGE_MIN, "Age cannot be negative.")
      .max(AGE_MAX, "Please enter a valid age."),
  ),
  nationality: z
    .string()
    .min(
      NATIONALITY_MIN_LENGTH,
      `Nationality must be at least ${NATIONALITY_MIN_LENGTH} characters.`,
    )
    .max(
      NATIONALITY_MAX_LENGTH,
      `Nationality must not exceed ${NATIONALITY_MAX_LENGTH} characters.`,
    ),
  contact_number: z
    .string()
    .min(1, "Contact number is required.")
    .min(CONTACT_NUMBER_MIN_LENGTH, `Contact number is too short.`)
    .max(CONTACT_NUMBER_MAX_LENGTH, `Contact number is too long.`),
  pool_access: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    },
    z.object({
      hasAccess: z.preprocess((val) => {
        if (typeof val === "string") {
          if (val === "true") return true;
          if (val === "false") return false;
        }
        return val;
      }, z.boolean()),
      access: z
        .array(
          z.object({
            date: z
              .string()
              .regex(
                STANDARD_DATE_PATTERN,
                "Date must be in YYYY-MM-DD format",
              ),
            am: z.preprocess(
              (val) =>
                val === null || val === undefined
                  ? null
                  : typeof val === "string"
                    ? val === "true"
                      ? true
                      : val === "false"
                        ? false
                        : null
                    : val,
              z.boolean().nullable(),
            ),
            pm: z.preprocess(
              (val) =>
                val === null || val === undefined
                  ? null
                  : typeof val === "string"
                    ? val === "true"
                      ? true
                      : val === "false"
                        ? false
                        : null
                    : val,
              z.boolean().nullable(),
            ),
          }),
        )
        .min(
          0,
          "You must provide an array for pool access days (can be empty if none).",
        )
        .max(POOL_ACCESS_MAX_DAYS, `Pool access days exceed allowed limit.`)
        .optional(),
    }),
  ),
  with_vehicle: z.preprocess((val) => {
    if (typeof val === "string") {
      if (val === "true") return true;
      if (val === "false") return false;
    }
    return val;
  }, z.boolean()),
  additional_guests: z.preprocess((val) => {
    if (Array.isArray(val)) {
      return val.map((item) => {
        if (typeof item === "string") {
          try {
            return JSON.parse(item);
          } catch {
            return item;
          }
        }
        return item;
      });
    }
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    }
    return val;
  }, z.array(additionalGuestSchema).max(ADDITIONAL_GUESTS_MAX, `You have exceeded the maximum number of additional guests.`).optional()),
  payment_type: z
    .string()
    .min(PAYMENT_TYPE_MIN_LENGTH, "Payment type is too short.")
    .max(PAYMENT_TYPE_MAX_LENGTH, "Payment type is too long."),
  agree_terms: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        if (val === "true") return true;
        if (val === "false") return false;
      }
      return val;
    },
    z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms",
    }),
  ),
  product_id: z
    .string()
    .max(UUID_MAX, `Product ID must be at most ${UUID_MAX} characters.`),
  //   status: z
  //     .string()
  //     .min(STATUS_MIN_LENGTH, "Status cannot be empty.")
  //     .max(STATUS_MAX_LENGTH, "Status is too long."),
});

export type BookingDTO = z.infer<typeof bookingSchema>;
