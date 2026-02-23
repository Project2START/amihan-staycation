import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { checkRole } from "../../middleware/checkRole";
import { createUpload } from "../../middleware/upload";
import { PHOTOS_MAX } from "../../shared/constants/productFormValidation";
import { validateSchema } from "../../middleware/validateSchema";
import { bookingSchema } from "./schemas/booking.schema";
import { asyncHandler } from "../../shared/helpers/asyncHandler";
import { bookingController } from "./controllers/booking.controller";

const router = Router();

const upload = createUpload();

router.post(
  "/",
  checkAuth,
  checkRole(["user", "agent"]),
  upload.fields([
    { name: "additional_guests_validIds", maxCount: PHOTOS_MAX },
    { name: "payment_proof", maxCount: 1 },
    { name: "valid_id", maxCount: 1 },
  ]),
  validateSchema(bookingSchema),
  asyncHandler(bookingController.createBooking),
);

export default router;
