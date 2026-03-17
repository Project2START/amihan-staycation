import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { checkRole } from "../../middleware/checkRole";
import { asyncHandler } from "../../shared/helpers/asyncHandler";
import { reviewController } from "./controllers/review.controller";
import { validateSchema } from "../../middleware/validateSchema";
import {
  createImportedReviewSchema,
  createInAppReviewSchema,
  updateReviewVisibilitySchema,
} from "./schemas/review.schema";

const router = Router();

router.get(
  "/product/:productId",
  asyncHandler(reviewController.getReviewsByProduct),
);

router.get(
  "/in-app-eligibility/:productId",
  checkAuth,
  checkRole(["user", "agent"]),
  asyncHandler(reviewController.getInAppEligibility),
);

router.post(
  "/in-app",
  checkAuth,
  checkRole(["user", "agent"]),
  validateSchema(createInAppReviewSchema),
  asyncHandler(reviewController.createInAppReview),
);

router.post(
  "/imported",
  checkAuth,
  checkRole(["admin"]),
  validateSchema(createImportedReviewSchema),
  asyncHandler(reviewController.createImportedReview),
);

router.patch(
  "/:reviewId/visibility",
  checkAuth,
  checkRole(["admin"]),
  validateSchema(updateReviewVisibilitySchema),
  asyncHandler(reviewController.updateReviewVisibility),
);

export default router;
