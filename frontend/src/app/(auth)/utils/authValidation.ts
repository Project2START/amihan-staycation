import { z, ZodTypeAny } from "zod";

// Standard constraints
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;

const EMAIL_MIN_LENGTH = 5;
const EMAIL_MAX_LENGTH = 254;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

// Predefined field schemas
const fieldSchemas: Record<string, ZodTypeAny> = {
  firstName: z
    .string()
    .min(NAME_MIN_LENGTH, `At least ${NAME_MIN_LENGTH} characters`)
    .max(NAME_MAX_LENGTH, `Exceeded ${NAME_MAX_LENGTH} characters`)
    .regex(/^[A-Za-z]+$/, "Can only contain letters"),

  lastName: z
    .string()
    .min(NAME_MIN_LENGTH, `At least ${NAME_MIN_LENGTH} characters`)
    .max(NAME_MAX_LENGTH, `Exceeded ${NAME_MAX_LENGTH} characters`)
    .regex(/^[A-Za-z]+$/, "Can only contain letters"),

  email: z
    .string()
    .min(
      EMAIL_MIN_LENGTH,
      `Email must be at least ${EMAIL_MIN_LENGTH} characters`
    )
    .max(EMAIL_MAX_LENGTH, `Email cannot exceed ${EMAIL_MAX_LENGTH} characters`)
    .email("Invalid email address"),

  password: z
    .string()
    .min(
      PASSWORD_MIN_LENGTH,
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
    )
    .max(
      PASSWORD_MAX_LENGTH,
      `Password cannot exceed ${PASSWORD_MAX_LENGTH} characters`
    )
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),

  confirmPassword: z.string(), // validated separately with refine
};

// Utility function
export function authValidationSchema(fields: (keyof typeof fieldSchemas)[]) {
  // Build object dynamically
  const schemaObject: Record<string, ZodTypeAny> = {};
  fields.forEach((field) => {
    if (fieldSchemas[field]) {
      schemaObject[field] = fieldSchemas[field];
    }
  });

  let schema = z.object(schemaObject);

  // If both password and confirmPassword exist, add match validation
  if (fields.includes("password") && fields.includes("confirmPassword")) {
    schema = schema.refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });
  }

  return schema;
}

// Example: infer TypeScript type
export type SchemaType<T extends ReturnType<typeof authValidationSchema>> =
  z.infer<T>;
