import { Prisma, PrismaClient, Agent } from "@prisma/client";

const prisma = new PrismaClient();

import { AppError, ConflictError } from "../../../shared/helpers/appErrors";

class AgentsRepository {
  async createAgent(data: Prisma.AgentUncheckedCreateInput) {
    try {
      return await prisma.agent.create({ data });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError("User is already an agent");
      }
      throw new AppError("Failed to create agent");
    }
  }

  async findAgentByUserId(userId: string) {
    try {
      return await prisma.agent.findUnique({ where: { userId } });
    } catch (error: any) {
      throw new AppError("Failed to find agent by user id");
    }
  }
  async findAgentById(id: string) {
    try {
      return await prisma.agent.findUnique({ where: { id } });
    } catch (error: any) {
      throw new AppError("Failed to find agent by id");
    }
  }

  async findAllAgents() {
    try {
      return await prisma.agent.findMany();
    } catch (error: any) {
      throw new AppError("Failed to find all agents");
    }
  }

  async findAgentsByAdminId(adminId: string) {
    try {
      return await prisma.agent.findMany({
        where: { adminId },
        include: { user: true },
      });
    } catch (error: any) {
      throw new AppError("Failed to find agents by admin id");
    }
  }

  async updateAgent(id: string, data: Prisma.AgentUpdateInput) {
    try {
      return await prisma.agent.update({ where: { id }, data });
    } catch (error: any) {
      throw new AppError("Failed to update agent");
    }
  }

  async deleteAgent(id: string) {
    try {
      return await prisma.agent.delete({ where: { id } });
    } catch (error: any) {
      throw new AppError("Failed to delete agent");
    }
  }
}

export const agentsRepository = new AgentsRepository();
