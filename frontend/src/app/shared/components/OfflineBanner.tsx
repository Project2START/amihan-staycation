"use client";
import { useOnlineStatus } from "./OfflineProvider";

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div
      style={{
        background: "#ffdddd",
        padding: "10px",
        textAlign: "center",
      }}
    >
      No internet connection — some features may not work.
    </div>
  );
}
