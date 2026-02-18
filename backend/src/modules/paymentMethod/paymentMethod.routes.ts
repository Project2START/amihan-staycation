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

router.put(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  upload.single("qr_code"),
  validateSchema(paymentMethodSchema),
  asyncHandler(paymentMethodController.updatePaymentMethod),
);

router.get(
  "/",
  requireAuth,
  checkRole(["admin"]),
  asyncHandler(paymentMethodController.getAllPaymentMethods),
);

// <<<< ORDER MATTERS HERE: FROM SPECIFIC ROUTE TO DYNAMIC ROUTE

router.get(
  "/public_products",
  requireAuth,
  checkRole(["user"]),
  asyncHandler(paymentMethodController.getAllByProductId),
);

router.get(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  asyncHandler(paymentMethodController.getPaymentMethod),
);

// >>>>
router.delete(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  asyncHandler(paymentMethodController.deletePaymentMethod),
);

export default router;
