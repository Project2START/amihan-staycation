"use client";

import { HOST } from "@/app/shared/constants/config";
import { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { io, Socket } from "socket.io-client";
export default function Notification() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const socket: Socket = io(`${HOST}`, { withCredentials: true });

    socket.emit("subscribe", { type: "notifications" });

    socket.on("notification:unread-count", (data) => {
      setUnreadCount(data.count);
      console.log(data.count);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <button className="relative">
        <span className="text-2xl text-gray-500">
          <IoNotificationsOutline />
        </span>
        {unreadCount > 0 ? (
          <div className="absolute top-[-10%] right-[-15%] bg-reject-normal rounded-full text-[0.5rem] text-white font-bold px-[0.25rem] py-[0.15rem]">
            {unreadCount}
          </div>
        ) : null}
      </button>
    </div>
  );
}
