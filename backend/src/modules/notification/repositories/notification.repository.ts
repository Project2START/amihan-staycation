import { PrismaClient, Notification } from "@prisma/client";

const prisma = new PrismaClient();

class NotificationRepository {
  async create(data: Omit<Notification, "id" | "createdAt">) {
    return prisma.notification.create({ data });
  }

  async findById(id: string) {
    return prisma.notification.findUnique({ where: { id } });
  }

  async findAll() {
    return prisma.notification.findMany();
  }

  async update(
    id: string,
    data: Partial<Omit<Notification, "id" | "createdAt">>,
  ) {
    return prisma.notification.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.notification.delete({ where: { id } });
  }

  async findByDestinationOrPublic(userDestinationId: string) {
    return prisma.notification.findMany({
      where: {
        OR: [{ userDestinationId }, { isPublic: true }],
      },
    });
  }

  async countUnreadByDestination(userDestinationId: string) {
    return prisma.notification.count({
      where: {
        userDestinationId,
        hasRead: false,
      },
    });
  }
}

export const notificationRepository = new NotificationRepository();
