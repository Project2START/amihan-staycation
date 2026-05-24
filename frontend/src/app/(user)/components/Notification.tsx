"use client";

import { HOST } from "@/app/shared/constants/config";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { io, Socket } from "socket.io-client";
import NotificationContent from "./NotificationContent";
import ClickOutside from "@/app/shared/ui/ClickOutside";
import { getAuthToken } from "@/app/shared/lib/getAuthToken";
export default function Notification() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [openNotif, setOpenNotif] = useState(false);

  const handleOpenNotif = () => {
    setOpenNotif(true);
  };
  const handleCloseNotif = () => {
    setOpenNotif(false);
  };

  useEffect(() => {
    let socket: Socket | null = null;

    const connect = async () => {
      const token = await getAuthToken();

      socket = io(`${HOST}`, {
        auth: token ? { token: `Bearer ${token}` } : undefined,
      });

      socket.emit("subscribe", { type: "notifications" });

      socket.on("notification:unread-count", (data) => {
        setUnreadCount(data.count);
      });
    };

    void connect();

    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      <button onClick={handleOpenNotif}>
        <span className="text-2xl text-gray-500">
          <IoNotificationsOutline />
        </span>
        {unreadCount > 0 ? (
          <div className="absolute top-[-10%] right-[-15%] bg-reject-normal rounded-full text-[0.5rem] text-white font-bold px-[0.25rem] py-[0.15rem]">
            {unreadCount}
          </div>
        ) : null}
      </button>

      <AnimatePresence initial={false}>
        {openNotif ? (
          <motion.div
            initial={{ opacity: 0, translateY: "-5%" }}
            animate={{ opacity: 1, translateY: "0%" }}
            exit={{ opacity: 0, translateY: "-5%" }}
            className="z-999 absolute right-0 top-[170%]"
          >
            <ClickOutside onClickOutside={handleCloseNotif}>
              <NotificationContent handleCloseNotif={handleCloseNotif} />
            </ClickOutside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
