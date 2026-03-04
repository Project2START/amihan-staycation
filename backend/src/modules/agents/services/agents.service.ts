import { NotFoundError } from "../../../shared/helpers/appErrors";
import { userRepository } from "../../user/repositories/user.repository";
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
