"use client";

import { useEffect, useState } from "react";
import AdminDesktopSidebar from "./AdminDesktopSidebar";
import HeaderAdmin from "./HeaderAdmin";

interface AdminDesktopShellProps {
  children: React.ReactNode;
}

const STORAGE_KEY = "admin-desktop-sidebar-open";

export default function AdminDesktopShell({
  children,
}: AdminDesktopShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "0") {
      setIsSidebarOpen(false);
      return;
    }
    if (saved === "1") {
      setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, isSidebarOpen ? "1" : "0");
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden">
      <AdminDesktopSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div
        className={`transition-[padding-left] duration-300 ease-in-out lg:h-screen lg:overflow-hidden ${
          isSidebarOpen ? "lg:pl-[240px]" : "lg:pl-[64px]"
        }`}
      >
        <HeaderAdmin />
        <main className="lg:h-[calc(100vh-72px)] lg:overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
