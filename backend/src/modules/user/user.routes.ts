import { Router } from "express";
import { validateSchema } from "../../middleware/validateSchema";
import { userSignInSchema, userSignUpSchema } from "./schemas/userAuth.schema";
import {
  passwordResetCompleteSchema,
  passwordResetRequestSchema,
  passwordResetValidateTokenSchema,
} from "./schemas/passwordReset.schema";
import { userUpdateSchema } from "./schemas/userUpdate.schema";
import { asyncHandler } from "../../shared/helpers/asyncHandler";
import { userAuthController } from "./controllers/userAuth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { checkRole } from "../../middleware/checkRole";
import { userController } from "./controllers/user.controller";
import { createUpload } from "../../middleware/upload";
import {
  passwordResetRateLimiter,
  strictAuthRateLimiter,
} from "../../middleware/rateLimit";

const upload = createUpload();

const router = Router();

router.post(
  "/sign-up",
  strictAuthRateLimiter,
  validateSchema(userSignUpSchema),
  asyncHandler(userAuthController.signUp),
);
router.post(
  "/sign-in",
  strictAuthRateLimiter,
  validateSchema(userSignInSchema),
  asyncHandler(userAuthController.signIn),
);
router.post(
  "/password-reset/request",
  passwordResetRateLimiter,
  validateSchema(passwordResetRequestSchema),
  asyncHandler(userAuthController.requestPasswordReset),
);
router.post(
  "/password-reset/validate-token",
  passwordResetRateLimiter,
  validateSchema(passwordResetValidateTokenSchema),
  asyncHandler(userAuthController.validatePasswordResetToken),
);
router.post(
  "/password-reset/complete",
  passwordResetRateLimiter,
  validateSchema(passwordResetCompleteSchema),
  asyncHandler(userAuthController.completePasswordReset),
);

router.get("/google", asyncHandler(userAuthController.googleAuth));

router.get(
  "/google/callback",
  asyncHandler(userAuthController.googleAuthCallback),
);

router.get(
  "/:id",
  checkAuth,
  checkRole(["user", "admin", "agent"]),
  asyncHandler(userController.getUser),
);

router.patch(
  "/:id",
  checkAuth,
  checkRole(["user", "admin", "agent"]),
  validateSchema(userUpdateSchema),
  asyncHandler(userController.updateUser),
);

router.patch(
  "/:id/avatar",
  checkAuth,
  checkRole(["user", "admin", "agent"]),
  upload.single("avatar"),
  asyncHandler(userController.updateAvatar),
);

router.delete(
  "/:id",
  checkAuth,
  checkRole(["user", "admin", "agent"]),
  asyncHandler(userController.deleteUser),
);

router.post("/logout", checkAuth, userAuthController.logout);

export default router;
