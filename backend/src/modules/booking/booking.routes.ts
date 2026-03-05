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

router.get(
  "/user/all",
  checkAuth,
  checkRole(["user", "agent"]),
  asyncHandler(bookingController.getAllBookingsUser),
);

router.get(
  "/:id/history",
  checkAuth,
  checkRole(["user", "admin", "agent"]),
  asyncHandler(bookingController.getBookingHistory),
);

router.post(
  "/history/respond",
  checkAuth,
  checkRole(["user", "agent"]),
  upload.fields([
    { name: "valid_id", maxCount: 1 },
    { name: "security_deposit", maxCount: 1 },
  ]),
  asyncHandler(bookingController.respondToHistory),
);

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

import { bookingUpdateSchema } from "./schemas/bookingUpdate.schema";

router.patch(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  validateSchema(bookingUpdateSchema),
  asyncHandler(bookingController.updateBooking),
);

export default router;
