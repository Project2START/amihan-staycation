import {
  ForbiddenError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";
import { userRepository } from "../../user/repositories/user.repository";
import { userService } from "../../user/services/user.service";
import { agentsRepository } from "../repositories/agents.repository";
import { AgentsDTO } from "../schemas/agents.schema";

class AgentsService {
  async create(agents: AgentsDTO, adminId: string) {
    const { email } = agents;

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError("Couldn't find email");
    }

    const newAgent = await agentsRepository.createAgent({
      adminId,
      userId: user.id,
    });

    try {
      await userRepository.update(user.id, { role: "agent" });
      return newAgent;
    } catch (error) {
      await agentsRepository.deleteAgent(newAgent.id);
      throw error;
    }
  }
  async get(agentId: string, adminId: string) {
    const agent = await agentsRepository.findAgentById(agentId);

    if (!agent) {
      throw new NotFoundError("Agent not found");
    }

    if (agent.adminId !== adminId) {
      throw new ForbiddenError(
        "You do not have permission to access this agent's data",
      );
    }

    const user = await userRepository.findById(agent.userId);

    if (!user) {
      throw new NotFoundError("Agent not found");
    }

    return {
      first_name: user.first_name,
      last_name: user.last_name,
      avatar_url: user.avatar_url,
      email: user.email,
      nationality: user.nationality,
      id: user.id,
    };
  }
  async getAgentByUserId(userId: string) {
    const agent = await agentsRepository.findAgentByUserId(userId);

    return agent;
  }
  async getAgentsByAdminId(adminId: string) {
    const agents = await agentsRepository.findAgentsByAdminId(adminId);

    const formattedAgent = agents.map((agent) => {
      const { user, userId, id } = agent;
      return {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        avatar_url: user.avatar_url,
        userId,
        id,
      };
    });

    return formattedAgent;
  }
}

export const agentsService = new AgentsService();
