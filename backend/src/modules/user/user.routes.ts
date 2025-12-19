import { Router } from "express";
import { validateSchema } from "../../middleware/validateSchema";
import { userSignInSchema, userSignUpSchema } from "./schemas/userAuth.schema";
import { asyncHandler } from "../../shared/helpers/asyncHandler";
import { userAuthController } from "./controllers/userAuth.controller";

const router = Router();

router.post(
  "/sign-up",
  validateSchema(userSignUpSchema),
  asyncHandler(userAuthController.signUp)
);
router.post(
  "/sign-in",
  validateSchema(userSignInSchema),
  asyncHandler(userAuthController.signIn)
);

router.get("/google", asyncHandler(userAuthController.googleAuth));

router.get(
  "/google/callback",
  asyncHandler(userAuthController.googleAuthCallback)
);

export default router;
