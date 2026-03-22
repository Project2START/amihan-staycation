import { Request, Response } from "express";
import { userService } from "../services/user.service";

class UserController {
  async getUser(req: Request, res: Response) {
    const { id } = req.params;

    const user = await userService.get(req, id);

    res.status(200).json({ message: "User successfully fetched", user });
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const requester = (req as any).user;

    const user = await userService.update(id, requester.user_id, req.body);

    res.status(200).json({ message: "User successfully updated", user });
  }

  async updateAvatar(req: Request, res: Response) {
    const { id } = req.params;
    const requester = (req as any).user;
    const file = (req.file as Express.Multer.File) || undefined;

    const user = await userService.updateAvatar(id, requester.user_id, file);

    res.status(200).json({ message: "Avatar successfully updated", user });
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const requester = (req as any).user;

    await userService.delete(id, requester.user_id);

    res.clearCookie("auth_token");
    res.clearCookie("user_id");
    res.status(200).json({ message: "Account successfully deleted" });
  }
}

export const userController = new UserController();
