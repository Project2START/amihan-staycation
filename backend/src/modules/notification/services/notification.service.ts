import { io } from "../../../app";
import { notificationRepository } from "../repositories/notification.repository";
import {
  NotificationUpdateDataDTO,
  NotificationUpdateIdentifierDTO,
} from "../schemas/notification.schema";
import { ForbiddenError } from "../../../shared/helpers/appErrors";
import { Notification } from "@prisma/client";

class NotificationService {
  async updateMany(
    identifier: NotificationUpdateIdentifierDTO,
    data: NotificationUpdateDataDTO,
    userId: string,
  ) {
    const { userDestinationId } = identifier;

    if (userDestinationId) {
      if (userDestinationId !== userId) {
        throw new ForbiddenError(
          "You don't have a permission to perform any action to this data.",
        );
      }

      await notificationRepository.updateMany(identifier, data);

      const unreadNotifCount =
        await notificationRepository.countUnreadByDestination(
          identifier.userDestinationId,
        );

      io.to(`notifications:${userDestinationId}`).emit(
        "notification:unread-count",
        {
          count: unreadNotifCount,
        },
      );
    }
  }

  async getMany(
    where: { userDestinationId: string },
    userId: string,
    options?: { skip?: number; take?: number },
  ) {
    const { userDestinationId } = where;

    if (userDestinationId) {
      if (userDestinationId !== userId) {
        throw new ForbiddenError(
          "You don't have a permission to view this data.",
        );
      }

      const notifications = await notificationRepository.findMany(
        where,
        options,
      );

      return notifications;
    }
  }
}

export const notificationService = new NotificationService();
