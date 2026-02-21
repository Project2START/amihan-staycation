import { Prisma, PrismaClient, Registrees, Users } from "@prisma/client";
import {
  AppError,
  ConflictError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";

const prisma = new PrismaClient();

class UserRepository {
  async create(data: Prisma.UsersCreateInput): Promise<Users> {
    try {
      return await prisma.users.create({ data });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError("Email already exists");
      }
      console.log(error);
      throw new AppError("Could not create user. Please try again.");
    }
  }

  async findById(id: string): Promise<Users | null> {
    try {
      return await prisma.users.findUnique({ where: { id } });
    } catch (error) {
      throw new AppError("Could not fetch user. Please try again.");
    }
  }
  async findByGoogleId(googleId: string): Promise<Users | null> {
    try {
      return await prisma.users.findUnique({ where: { google_id: googleId } });
    } catch (error) {
      console.log(error);
      throw new AppError(
        "Could not fetch user by Google ID. Please try again.",
      );
    }
  }
  async findByEmail(email: string): Promise<Users | null> {
    try {
      return await prisma.users.findUnique({ where: { email } });
    } catch (error) {
      throw new AppError("Could not fetch user. Please try again.");
    }
  }

  async update(id: string, data: Prisma.UsersUpdateInput): Promise<Users> {
    try {
      return await prisma.users.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("User not found");
      }
      throw new AppError("Could not update user. Please try again.");
    }
  }

  async delete(id: string): Promise<Users> {
    try {
      return await prisma.users.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("User not found");
      }
      throw new AppError("Could not delete user. Please try again.");
    }
  }
}

export const userRepository = new UserRepository();
