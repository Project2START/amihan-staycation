import bcrypt from "bcrypt";
import prisma from "../../config/prismaClient";
import { UserSignUpType } from "./user.schema";
import { Prisma } from "@prisma/client";

export const UserService = {
  //   async getAll(): Promise<IUser[]> {
  //     return UserModel.find();
  //   },

  //   async getById(id: string): Promise<IUser | null> {
  //     return UserModel.findById(id);
  //   },

  async create(user: UserSignUpType) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await prisma.users.create({
        data: {
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          password: hashedPassword,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("Email already in use");
      }
      throw new Error("Internal server error");
    }
  },
};
