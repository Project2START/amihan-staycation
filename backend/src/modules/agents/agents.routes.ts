import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { checkRole } from "../../middleware/checkRole";
import { validateSchema } from "../../middleware/validateSchema";
import { agentsSchema } from "./schemas/agents.schema";
import { asyncHandler } from "../../shared/helpers/asyncHandler";
import { agentsController } from "./controllers/agents.controller";

const router = Router();

router.get(
  "/",
  checkAuth,
  checkRole(["admin"]),
  asyncHandler(agentsController.getAgentsByAdminId),
);

router.post(
  "/",
  checkAuth,
  checkRole(["admin"]),
  validateSchema(agentsSchema),
  asyncHandler(agentsController.createAgent),
);

export default router;
