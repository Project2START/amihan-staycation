import { Request, Response } from "express";
import { UserService } from "./user.service";

export const UserController = {
  //   async getUsers(_req: Request, res: Response) {
  //     const users = await UserService.getAll();
  //     res.json(users);
  //   },

  //   async getUser(req: Request, res: Response) {
  //     const user = await UserService.getById(req.params.id);
  //     if (!user) return res.status(404).json({ message: "User not found" });
  //     res.json(user);
  //   },

  async createUser(req: Request, res: Response) {
    try {
      await UserService.create(req.body);
      res.status(201).json({ message: "Account successfully created" });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  },
};
