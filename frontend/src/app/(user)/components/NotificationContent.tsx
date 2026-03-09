"use client";

import axios from "axios";
import { HOST } from "@/app/shared/constants/config";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import NotificationList from "./NotificationList";

export default function NotificationContent() {
  const user = useAppSelector((state) => state.users.data);

  const handleUpdateNotif = async () => {
    try {
      await axios.patch(
        `${HOST}/api/notifications`,
        {
          identifier: { userDestinationId: user?.id },
          data: { hasRead: true },
        },
        { withCredentials: true },
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    handleUpdateNotif();
  }, [user?.id]);

  return (
    <div className="w-[15rem] h-[20rem] bg-white shadow-lg rounded-lg">
      <NotificationList />
    </div>
  );
}
