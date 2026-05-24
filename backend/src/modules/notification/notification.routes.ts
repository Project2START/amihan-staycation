import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { notificationController } from "./controllers/notification.controller";
import { validateSchema } from "../../middleware/validateSchema";
import { notificationUpdateSchema } from "./schemas/notification.schema";
import { asyncHandler } from "../../shared/helpers/asyncHandler";

const router = Router();

router.get(
  "/",
  checkAuth,
  asyncHandler(notificationController.getNotifications),
);

router.patch(
  "/",
  checkAuth,
  validateSchema(notificationUpdateSchema),
  asyncHandler(notificationController.updateNotifications),
);

export default router;
