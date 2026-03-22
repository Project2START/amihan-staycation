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
  async getAgentById(req: Request, res: Response) {
    const user = (req as any).user;
    const agentId = req.params.id;

    const agent = await agentsService.get(agentId, user.user_id);

    res.status(200).json({
      message: "Agent successfully retrieved",
      agent,
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
  async remove(req: Request, res: Response) {
    const agentId = req.params.id;
    const user = (req as any).user;

    await agentsService.removeAgent(agentId, user.user_id);

    res.status(200).json({ message: "Agent successfully removed" });
  }
}

export const agentsController = new AgentsController();
