import z from "zod";

export const ACCOUNT_NAME_MIN = 2;
export const ACCOUNT_NAME_MAX = 100;
export const ACCOUNT_NUMBER_MIN = 5;
export const ACCOUNT_NUMBER_MAX = 30;
export const PAYMENT_METHOD_MIN = 2;
export const PAYMENT_METHOD_MAX = 50;

export const paymentMethodSchema = z.object({
  payment_method: z
    .string()
    .min(
      PAYMENT_METHOD_MIN,
      `Payment method must be at least ${PAYMENT_METHOD_MIN} characters.`,
    )
    .max(
      PAYMENT_METHOD_MAX,
      `Payment method must not exceed ${PAYMENT_METHOD_MAX} characters.`,
    ),
  account_name: z
    .string()
    .min(
      ACCOUNT_NAME_MIN,
      `Account name must be at least ${ACCOUNT_NAME_MIN} characters.`,
    )
    .max(
      ACCOUNT_NAME_MAX,
      `Account name must not exceed ${ACCOUNT_NAME_MAX} characters.`,
    ),
  account_number: z
    .string()
    .min(
      ACCOUNT_NUMBER_MIN,
      `Account number must be at least ${ACCOUNT_NUMBER_MIN} characters.`,
    )
    .max(
      ACCOUNT_NUMBER_MAX,
      `Account number must not exceed ${ACCOUNT_NUMBER_MAX} characters.`,
    ),
});

export type PaymentMethodDTO = z.infer<typeof paymentMethodSchema>;
