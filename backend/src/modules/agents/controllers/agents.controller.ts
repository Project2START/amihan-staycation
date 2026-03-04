import { Request, Response } from "express";
import { agentsService } from "../services/agents.service";

class AgentsController {
  async createAgent(req: Request, res: Response) {
    const admin = (req as any).user;

    await agentsService.create(req.body, admin.user_id);

    res.status(201).json({
      message: "Agent successfully created",
    });
  }
  async getAgentsByAdminId(req: Request, res: Response) {
    const admin = (req as any).user;

    const agents = await agentsService.getAgentsByAdminId(admin.user_id);

    res.status(200).json({
      message: "Agents successfully retrieved",
      agents,
    });
  }
}

export const agentsController = new AgentsController();
