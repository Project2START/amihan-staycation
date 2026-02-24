"use client";
import { createContext, useContext, useEffect, useState } from "react";

const OfflineContext = createContext(true);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <OfflineContext.Provider value={isOnline}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOnlineStatus() {
  return useContext(OfflineContext);
}
