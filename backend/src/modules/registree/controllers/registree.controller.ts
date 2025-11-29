import { Request, Response } from "express";
import { registreeService } from "../services/registree.service";
import { cookieOptions } from "../../../shared/helpers/cookieOptions";

export class RegistreeController {
  async register(req: Request, res: Response) {
    const newRegistree = await registreeService.create(req.body);
    const cookieMaxAge = newRegistree.codeExpiry.getTime() - Date.now();

    res.cookie("registree_id", newRegistree.id, cookieOptions(cookieMaxAge));

    res.status(201).json({
      message: "Registree successfully created",
    });
  }
}

export const registreeController = new RegistreeController();
