"use client";

import { HOST } from "@/app/shared/constants/config";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { io, Socket } from "socket.io-client";
import NotificationContent from "./NotificationContent";
import ClickOutside from "@/app/shared/ui/ClickOutside";
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
    const socket: Socket = io(`${HOST}`, { withCredentials: true });

    socket.emit("subscribe", { type: "notifications" });

    socket.on("notification:unread-count", (data) => {
      setUnreadCount(data.count);
    });

    return () => {
      socket.disconnect();
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
            className="z-999 absolute right-0 top-[120%]"
          >
            <ClickOutside onClickOutside={handleCloseNotif}>
              <NotificationContent />
            </ClickOutside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
