import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth";
import { checkRole } from "../../middleware/checkRole";
import { createUpload } from "../../middleware/upload";
import { validateSchema } from "../../middleware/validateSchema";
import { paymentMethodSchema } from "./schemas/paymentMethod.schema";
import { asyncHandler } from "../../shared/helpers/asyncHandler";
import { paymentMethodController } from "./controllers/paymentMethod.controller";

const router = Router();

const upload = createUpload({ maxFiles: 1 });

router.post(
  "/",
  requireAuth,
  checkRole(["admin"]),
  upload.single("qr_code"),
  validateSchema(paymentMethodSchema),
  asyncHandler(paymentMethodController.createPaymentMethod),
);

router.get(
  "/",
  requireAuth,
  checkRole(["admin"]),
  asyncHandler(paymentMethodController.getAllPaymentMethods),
);

router.delete(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  asyncHandler(paymentMethodController.deletePaymentMethod),
);

export default router;
