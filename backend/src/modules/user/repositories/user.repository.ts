import { Prisma, PrismaClient, Registrees, Users } from "@prisma/client";
import {
  AppError,
  ConflictError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";

const prisma = new PrismaClient();

export type PrismaTx = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$transaction" | "$extends" | "$on"
>;

class UserRepository {
  async create(data: Prisma.UsersCreateInput): Promise<Users> {
    try {
      return await prisma.users.create({ data });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError("Email already exists");
      }
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

  async update(
    id: string,
    data: Prisma.UsersUpdateInput,
    tx?: PrismaTx,
  ): Promise<Users> {
    const db = tx ?? prisma;
    try {
      return await db.users.update({ where: { id }, data });
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
      console.log(error);
      if (error.code === "P2025") {
        throw new NotFoundError("User not found");
      }
      throw new AppError("Could not delete user. Please try again.");
    }
  }
}

export const userRepository = new UserRepository();
