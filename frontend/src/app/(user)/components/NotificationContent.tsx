"use client";

import NotificationList from "./NotificationList";

export default function NotificationContent() {
  return (
    <div className="py-3 w-[20rem] h-[20rem] bg-white shadow-lg rounded-lg overflow-y-auto">
      <NotificationList />
    </div>
  );
}
