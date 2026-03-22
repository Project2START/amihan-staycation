import { PrismaClient } from "@prisma/client";
import {
  AppError,
  ForbiddenError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";
import { userRepository } from "../../user/repositories/user.repository";
import { userService } from "../../user/services/user.service";
import { agentsRepository } from "../repositories/agents.repository";
import { AgentsDTO } from "../schemas/agents.schema";
import { bookingRepository } from "../../booking/repositories/bookings.repository";

const prisma = new PrismaClient();

class AgentsService {
  async create(agents: AgentsDTO, adminId: string) {
    const { email } = agents;

    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError("User email does not exist");
    }

    const agent = await agentsRepository.findAgentByUserId(user.id);

    if (agent && agent.isDeleted) {
      await prisma.$transaction(async (tx) => {
        await userRepository.update(agent.userId, { role: "agent" }, tx);
        await agentsRepository.updateAgent(agent.id, { isDeleted: false }, tx);
      });
    } else {
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
      id: agent.id,
      userId: agent.userId,
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
  async removeAgent(agentId: string, adminId: string) {
    const agent = await this.get(agentId, adminId);

    try {
      await prisma.$transaction(async (tx) => {
        await bookingRepository.updateManyByUserId(
          agent.userId,
          { status: "cancelled" },
          tx,
        );
        await userRepository.update(agent.userId, { role: "user" }, tx);
        await agentsRepository.updateAgent(agent.id, { isDeleted: true }, tx);
      });
    } catch (error: any) {
      console.log(error);
      throw new AppError("Failed to remove agent. Please try again later.");
    }
  }
}

export const agentsService = new AgentsService();
