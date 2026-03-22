import z from "zod";
import { ReviewSource } from "@prisma/client";

export const createInAppReviewSchema = z.object({
  productId: z.string().uuid("Invalid product id."),
  rating: z
    .number({ message: "Rating is required." })
    .int("Rating must be a whole number.")
    .min(1, "Rating must be at least 1 star.")
    .max(5, "Rating cannot exceed 5 stars."),
  comment: z
    .string()
    .max(1000, "Comment cannot exceed 1000 characters.")
    .optional()
    .transform((value) => {
      if (!value) return undefined;
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    }),
});

export const updateReviewVisibilitySchema = z.object({
  isHidden: z.boolean({ message: "isHidden is required." }),
});

export const createImportedReviewSchema = z.object({
  productId: z.string().uuid("Invalid product id."),
  reviewerName: z
    .string({ message: "Reviewer name is required." })
    .trim()
    .min(1, "Reviewer name is required.")
    .max(120, "Reviewer name cannot exceed 120 characters."),
  source: z.nativeEnum(ReviewSource, {
    message: "Review source is required.",
  }),
  originalDate: z
    .string({ message: "Original review date is required." })
    .datetime("Original date must be a valid ISO date."),
  rating: z
    .number({ message: "Rating is required." })
    .int("Rating must be a whole number.")
    .min(1, "Rating must be at least 1 star.")
    .max(5, "Rating cannot exceed 5 stars."),
  comment: z
    .string()
    .max(1000, "Comment cannot exceed 1000 characters.")
    .optional()
    .transform((value) => {
      if (!value) return undefined;
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    }),
});

export type CreateInAppReviewDTO = z.infer<typeof createInAppReviewSchema>;
export type CreateImportedReviewDTO = z.infer<
  typeof createImportedReviewSchema
>;
export type UpdateReviewVisibilityDTO = z.infer<
  typeof updateReviewVisibilitySchema
>;
