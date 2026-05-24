import { Prisma, PrismaClient, Registrees } from "@prisma/client";
import {
  AppError,
  ConflictError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";

const prisma = new PrismaClient();

class RegistreeRepository {
  async create(data: Prisma.RegistreesCreateInput): Promise<Registrees> {
    try {
      return await prisma.registrees.create({ data });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError("Email already exists");
      }
      throw new AppError("Could not create registree. Please try again");
    }
  }

  async findById(id: string): Promise<Registrees | null> {
    try {
      return await prisma.registrees.findUnique({ where: { id } });
    } catch (error) {
      throw new AppError("Could not fetch registree. Please try again");
    }
  }

  async update(
    id: string,
    data: Prisma.RegistreesUpdateInput,
  ): Promise<Registrees> {
    try {
      return await prisma.registrees.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("Registree not found");
      }
      throw new AppError("Could not update registree. Please try again");
    }
  }

  async delete(id: string): Promise<Registrees> {
    try {
      return await prisma.registrees.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("Registree not found");
      }
      throw new AppError("Could not delete registree. Please try again");
    }
  }

  async deleteManyByEmail(email: string): Promise<{ count: number }> {
    try {
      const result = await prisma.registrees.deleteMany({ where: { email } });

      return result;
    } catch (error: any) {
      throw new AppError("Could not delete registree/s. Please try again");
    }
  }
}

export const registreeRepository = new RegistreeRepository();
