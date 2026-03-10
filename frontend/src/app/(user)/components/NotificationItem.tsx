"use client";

import Link from "next/link";

interface NotificationUserOwner {
  avatar_url: string;
  first_name: string;
  id: string;
  last_name: string;
}

export interface INotificationItem {
  createdAt: string;
  hasRead: boolean;
  id: string;
  message: string;
  pathId: string;
  pathType: string;
  title: string;
  userDestinationId: string;
  userOwner: NotificationUserOwner;
  userOwnerId: string;
}

export default function NotificationItem({
  notification,
}: {
  notification: INotificationItem;
}) {
  const { title, message, createdAt, hasRead, userOwner } = notification;
  const fullName = `${userOwner.first_name} ${userOwner.last_name}`;
  const timeAgo = formatTimeAgo(createdAt);

  return (
    <Link
      href="#"
      className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-100 ${
        !hasRead ? "bg-blue-50" : ""
      }`}
    >
      <img
        src={userOwner.avatar_url}
        alt={fullName}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            !hasRead ? "font-semibold text-gray-900" : "text-gray-700"
          }`}
        >
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{message}</p>
        <span className="text-[0.65rem] text-gray-400 mt-1 block">
          {timeAgo}
        </span>
      </div>
      {!hasRead && (
        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
      )}
    </Link>
  );
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
