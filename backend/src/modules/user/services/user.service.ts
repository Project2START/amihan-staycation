import { Request } from "express";
import { userRepository } from "../repositories/user.repository";
import {
  ForbiddenError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";

class UserService {
  async get(req: Request, id: string) {
    const user = await userRepository.findById(id);

    if (!user) throw new NotFoundError("User not found");

    const sentUser = (req as any).user;
    const sentUserId = sentUser.user_id;

    if (user.id !== sentUserId)
      throw new ForbiddenError(
        "You do not have permission to access this account",
      );

    const { password, created_at, updated_at, google_id, ...rest } = user;

    return rest;
  }
}

export const userService = new UserService();
