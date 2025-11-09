import { z } from "zod";

const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+){0,2}$/;

export const userSignUpSchema = z.object({
  firstName: z
    .string()
    .nonempty("First name is required")
    .max(50, "First name too long") // optional character length limit
    .regex(nameRegex, "First name can only contain letters and max 3 words"),

  lastName: z
    .string()
    .nonempty("Last name is required")
    .max(50, "Last name too long")
    .regex(nameRegex, "Last name can only contain letters and max 3 words"),

  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email format")
    .max(100, "Email too long"), // reasonable max length

  password: z
    .string()
    .nonempty("Password is required")
    .max(50, "Password too long"),
});

export type UserSignUpType = z.infer<typeof userSignUpSchema>;
