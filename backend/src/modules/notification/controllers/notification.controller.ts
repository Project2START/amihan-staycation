import { Request, Response } from "express";
import { notificationService } from "../services/notification.service";

class NotificationController {
  async updateNotifications(req: Request, res: Response) {
    const user = (req as any).user;

    const { identifier, data } = req.body;

    await notificationService.updateMany(identifier, data, user.user_id);

    res.status(200).json({
      message: "Notifications successfully updated",
    });
  }

  async getNotifications(req: Request, res: Response) {
    const user = (req as any).user;

    const { take, skip, userDestinationId } = req.query;

    const takeFormatted = take ? Number(take) : undefined;
    const skipFormatted = skip ? Number(skip) : undefined;

    const where: any = {};

    where.userDestinationId = user.user_id;

    if (userDestinationId) {
      where.userDestinationId = userDestinationId;
    }

    const notifications = await notificationService.getMany(
      where,
      user.user_id,
      {
        take: takeFormatted,
        skip: skipFormatted,
      },
    );

    res
      .status(200)
      .json({ message: "Notifications successfully fetched.", notifications });
  }
}

export const notificationController = new NotificationController();
