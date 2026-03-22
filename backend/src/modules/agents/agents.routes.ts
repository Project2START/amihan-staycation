import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { checkRole } from "../../middleware/checkRole";
import { validateSchema } from "../../middleware/validateSchema";
import { agentsSchema } from "./schemas/agents.schema";
import { asyncHandler } from "../../shared/helpers/asyncHandler";
import { agentsController } from "./controllers/agents.controller";

const router = Router();

router.get(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  asyncHandler(agentsController.getAgentById),
);

router.get(
  "/",
  checkAuth,
  checkRole(["admin"]),
  asyncHandler(agentsController.getAgentsByAdminId),
);

// router.get(
//   "/",
//   checkAuth,
//   checkRole(["admin"]),
//   asyncHandler(agentsController.getAgentsByAdminId),
// );

router.post(
  "/",
  checkAuth,
  checkRole(["admin"]),
  validateSchema(agentsSchema),
  asyncHandler(agentsController.createAgent),
);

router.delete(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  asyncHandler(agentsController.remove),
);

export default router;
