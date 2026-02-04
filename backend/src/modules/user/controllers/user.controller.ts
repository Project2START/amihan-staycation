import { Request, Response } from "express";
import { userService } from "../services/user.service";

export class UserController {
  async getUser(req: Request, res: Response) {
    const { id } = req.params;

    const user = await userService.get(req, id);

    res.status(200).json({ message: "User successfully fetched", user });
  }
}

export const userController = new UserController();
