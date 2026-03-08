"use client";

import { HOST } from "@/app/shared/constants/config";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export default function SocketComponent() {
  useEffect(() => {
    // Replace with your server URL
    const socket: Socket = io(`${HOST}`, { withCredentials: true });

    socket.emit("subscribe", { type: "notifications" });
    // Example: Listen for events
    socket.on("notification:unread-count", (data) => {
      console.log(data);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Socket.IO Client Ready</div>;
}
