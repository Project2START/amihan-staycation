import { PrismaClient, Notification, Prisma } from "@prisma/client";
import {
  AppError,
  ConflictError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";

const prisma = new PrismaClient();

const userOwnerSelect = {
  first_name: true,
  last_name: true,
  avatar_url: true,
  id: true,
};

type NotificationWithRelations = Prisma.NotificationGetPayload<{
  include: {
    userOwner: {
      select: typeof userOwnerSelect;
    };
  };
}>;

class NotificationRepository {
  async create(data: Omit<Notification, "id" | "createdAt">) {
    try {
      return await prisma.notification.create({ data });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError("Notification already exists");
      }
      throw new AppError("Could not create notification. Please try again");
    }
  }

  async findById(id: string) {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id },
      });
      if (!notification) {
        throw new NotFoundError("Notification not found");
      }
      return notification;
    } catch (error) {
      throw new AppError("Could not fetch notification. Please try again");
    }
  }

  async findAll() {
    try {
      return await prisma.notification.findMany();
    } catch (error) {
      throw new AppError("Could not fetch notifications. Please try again");
    }
  }

  async update(
    id: string,
    data: Partial<Omit<Notification, "id" | "createdAt">>,
  ) {
    try {
      return await prisma.notification.update({ where: { id }, data });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("Notification not found");
      }
      throw new AppError("Could not update notification. Please try again");
    }
  }

  async delete(id: string) {
    try {
      return await prisma.notification.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new NotFoundError("Notification not found");
      }
      throw new AppError("Could not delete notification. Please try again");
    }
  }

  async findByDestinationOrPublic(userDestinationId: string) {
    try {
      return await prisma.notification.findMany({
        where: {
          OR: [{ userDestinationId }, { isPublic: true }],
        },
      });
    } catch (error) {
      throw new AppError("Could not fetch notifications. Please try again");
    }
  }

  async countUnreadByDestination(userDestinationId: string) {
    try {
      return await prisma.notification.count({
        where: {
          userDestinationId,
          hasRead: false,
        },
      });
    } catch (error) {
      throw new AppError(
        "Could not count unread notifications. Please try again",
      );
    }
  }

  async updateMany(
    where: Partial<Notification>,
    data: Partial<Omit<Notification, "id" | "createdAt">>,
  ) {
    try {
      return await prisma.notification.updateMany({ where, data });
    } catch (error) {
      throw new AppError("Could not update notifications. Please try again");
    }
  }

  async findMany(
    where: Partial<Notification>,
    options?: { take?: number; skip?: number },
  ): Promise<Partial<NotificationWithRelations>[]> {
    try {
      return await prisma.notification.findMany({
        where,
        ...options,
        include: { userOwner: { select: userOwnerSelect } },
      });
    } catch (error) {
      throw new AppError("Could not fetch notifications. Please try again");
    }
  }
}

export const notificationRepository = new NotificationRepository();
