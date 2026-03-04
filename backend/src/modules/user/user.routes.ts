import { Router } from "express";
import { validateSchema } from "../../middleware/validateSchema";
import { userSignInSchema, userSignUpSchema } from "./schemas/userAuth.schema";
import { userUpdateSchema } from "./schemas/userUpdate.schema";
import { asyncHandler } from "../../shared/helpers/asyncHandler";
import { userAuthController } from "./controllers/userAuth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { checkRole } from "../../middleware/checkRole";
import { userController } from "./controllers/user.controller";
import { createUpload } from "../../middleware/upload";

const upload = createUpload();

const router = Router();

router.post(
  "/sign-up",
  validateSchema(userSignUpSchema),
  asyncHandler(userAuthController.signUp),
);
router.post(
  "/sign-in",
  validateSchema(userSignInSchema),
  asyncHandler(userAuthController.signIn),
);

router.get("/google", asyncHandler(userAuthController.googleAuth));

router.get(
  "/google/callback",
  asyncHandler(userAuthController.googleAuthCallback),
);

router.get(
  "/:id",
  checkAuth,
  checkRole(["user", "admin"]),
  asyncHandler(userController.getUser),
);

router.patch(
  "/:id",
  checkAuth,
  checkRole(["user", "admin"]),
  validateSchema(userUpdateSchema),
  asyncHandler(userController.updateUser),
);

router.patch(
  "/:id/avatar",
  checkAuth,
  checkRole(["user", "admin"]),
  upload.single("avatar"),
  asyncHandler(userController.updateAvatar),
);

router.delete(
  "/:id",
  checkAuth,
  checkRole(["user", "admin"]),
  asyncHandler(userController.deleteUser),
);

router.post("/logout", checkAuth, userAuthController.logout);

export default router;
