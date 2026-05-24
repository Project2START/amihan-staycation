import { Router } from "express";
import { validateSchema } from "../../middleware/validateSchema";
import { registreeSchema } from "./schemas/registree.schema";
import { registreeVerifySchema } from "./schemas/registreeAuth.schema";
import { registreeController } from "./controllers/registree.controller";
import { registreeAuthController } from "./controllers/registreeAuth.controller";
import { asyncHandler } from "../../shared/helpers/asyncHandler";

const router = Router();

// GET

// POST

router.post(
  "/register",
  validateSchema(registreeSchema),
  asyncHandler(registreeController.register)
);

router.post(
  "/verify",
  validateSchema(registreeVerifySchema),
  asyncHandler(registreeAuthController.verifyRegistree)
);

router.post(
  "/resend-v-code",
  validateSchema(registreeVerifySchema),
  asyncHandler(registreeAuthController.resendRegistreeVCode)
);
export default router;
