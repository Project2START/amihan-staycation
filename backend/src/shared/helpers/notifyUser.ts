import { notificationRepository } from "../../modules/notification/repositories/notification.repository";
import { io } from "../../app";

/**
 * Notifies a user with their unread notification count via socket.io.
 * @param id User ID (string or null)
 */
export const notifyUser = async (id: string | null) => {
  if (!id) return;
  const unreadNotifCount =
    await notificationRepository.countUnreadByDestination(id);
  io.to(`notifications:${id}`).emit("notification:unread-count", {
    count: unreadNotifCount,
  });
};
