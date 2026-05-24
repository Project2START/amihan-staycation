import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
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
  checkAuth,
  checkRole(["admin"]),
  upload.single("qr_code"),
  validateSchema(paymentMethodSchema),
  asyncHandler(paymentMethodController.createPaymentMethod),
);

router.put(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  upload.single("qr_code"),
  validateSchema(paymentMethodSchema),
  asyncHandler(paymentMethodController.updatePaymentMethod),
);

router.get(
  "/",
  checkAuth,
  checkRole(["admin"]),
  asyncHandler(paymentMethodController.getAllPaymentMethods),
);

// <<<< ORDER MATTERS HERE: FROM SPECIFIC ROUTE TO DYNAMIC ROUTE

router.get(
  "/public_products",
  checkAuth,
  checkRole(["user", "agent"]),
  asyncHandler(paymentMethodController.getAllByProductId),
);

router.get(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  asyncHandler(paymentMethodController.getPaymentMethod),
);

// >>>>
router.delete(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  asyncHandler(paymentMethodController.deletePaymentMethod),
);

export default router;
