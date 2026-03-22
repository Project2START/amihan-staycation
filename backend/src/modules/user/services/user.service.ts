import { Request } from "express";
import { userRepository } from "../repositories/user.repository";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";
import { UserUpdateDTO } from "../schemas/userUpdate.schema";
import { uploadFileToSupabase } from "../../../shared/helpers/uploadFileToSupabase";
import { supabase } from "../../../shared/lib/supabase";

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

  async update(userId: string, requesterId: string, data: UserUpdateDTO) {
    const user = await userRepository.findById(userId);

    if (!user) throw new NotFoundError("User not found");

    if (user.id !== requesterId)
      throw new ForbiddenError(
        "You do not have permission to update this account",
      );

    const updated = await userRepository.update(userId, data);

    const { password, created_at, updated_at, google_id, ...rest } = updated;

    return rest;
  }

  async updateAvatar(
    userId: string,
    requesterId: string,
    file: Express.Multer.File | undefined,
  ) {
    const user = await userRepository.findById(userId);

    if (!user) throw new NotFoundError("User not found");

    if (user.id !== requesterId)
      throw new ForbiddenError(
        "You do not have permission to update this account",
      );

    if (!file) throw new BadRequestError("Avatar file is required");

    // Upload new avatar
    const uploaded = await uploadFileToSupabase(file, "avatars");

    // Delete old avatar from storage if it exists and is a Supabase URL
    if (user.avatar_url && user.avatar_url.includes("supabase.co")) {
      try {
        const oldPath = user.avatar_url.split("/images/").pop();
        if (oldPath) {
          await supabase.storage.from("images").remove([oldPath]);
        }
      } catch {
        // Ignore deletion errors for old avatar
      }
    }

    const updated = await userRepository.update(userId, {
      avatar_url: uploaded.publicUrl,
    });

    const { password, created_at, updated_at, google_id, ...rest } = updated;

    return rest;
  }

  async delete(userId: string, requesterId: string) {
    const user = await userRepository.findById(userId);

    if (!user) throw new NotFoundError("User not found");

    if (user.id !== requesterId)
      throw new ForbiddenError(
        "You do not have permission to delete this account",
      );

    await userRepository.delete(userId);
  }
}

export const userService = new UserService();
