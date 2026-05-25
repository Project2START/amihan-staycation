"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { adminNavItems } from "./adminNavItems";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { IoMdPerson } from "react-icons/io";
import { logout } from "@/app/(user)/api/logout";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { resetUser } from "@/lib/features/users/usersSlice";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import LoadingOverlay from "@/app/shared/ui/LoadingOverlay";
import { resetAuthTokenCache } from "@/app/shared/lib/getAuthToken";

interface AdminDesktopSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdminDesktopSidebar({
  isOpen,
  onToggle,
}: AdminDesktopSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.data);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();

      await fetch("/api/auth/clear-cookies", {
        method: "DELETE",
      });

      resetAuthTokenCache();
      dispatch(resetUser());
      router.replace("/sign-in");
    } catch (err) {
      CustomToast.show(errorHandler(err).message, { indicator: "error" });
    } finally {
      setLoggingOut(false);
    }
  };

  const isActiveRoute = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside
      id="admin-desktop-sidebar"
      aria-label="Admin primary navigation"
      className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:flex-col lg:border-r lg:border-secondary-normal/10 lg:bg-white lg:shadow-sm lg:transition-[width] lg:duration-300 lg:ease-in-out ${
        isOpen ? "lg:w-[240px]" : "lg:w-[64px]"
      }`}
    >
      <div
        className={`relative flex h-[36px] items-center border-b border-secondary-normal/10 ${
          isOpen ? "justify-end px-3" : "justify-center px-1"
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          aria-controls="admin-desktop-sidebar"
          aria-expanded={isOpen}
          className={`absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-secondary-normal transition-colors hover:bg-secondary-normal/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-normal/60 ${
            !isOpen ? "right-1" : ""
          }`}
        >
          {isOpen ? (
            <MdKeyboardDoubleArrowLeft size={20} />
          ) : (
            <MdKeyboardDoubleArrowRight size={20} />
          )}
        </button>
      </div>

      <div className="border-b border-secondary-normal/10 px-2 py-3">
        <Link
          href="/profile"
          aria-label="View profile"
          title={!isOpen ? "View profile" : undefined}
          className={`group flex items-center rounded-lg px-2 py-2 text-secondary-normal transition-colors hover:bg-secondary-normal/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-normal/60 ${
            isOpen ? "gap-3" : "justify-center"
          }`}
        >
          {user?.avatar_url ? (
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-secondary-normal/20">
              <Image
                src={user.avatar_url}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-secondary-normal/20 text-xl text-secondary-normal/70">
              <IoMdPerson />
            </span>
          )}

          {isOpen && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="block text-xs text-secondary-normal/70 underline">
                View profile
              </span>
            </span>
          )}
        </Link>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto px-2 py-3"
        aria-label="Admin sections"
      >
        <ul className="space-y-1">
          {adminNavItems.map((item) => {
            const isActive = isActiveRoute(item.path);

            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  aria-label={item.name}
                  aria-current={isActive ? "page" : undefined}
                  title={!isOpen ? item.name : undefined}
                  className={`group flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-normal/60 ${
                    isOpen ? "gap-3" : "justify-center"
                  } ${
                    isActive
                      ? "bg-secondary-normal/10 font-bold text-secondary-normal"
                      : "text-secondary-normal/70 hover:bg-secondary-normal/5 hover:text-secondary-normal"
                  }`}
                >
                  <item.icon
                    className={`shrink-0 text-xl ${
                      isActive ? "text-secondary-normal" : ""
                    }`}
                  />
                  <span className={`${isOpen ? "inline" : "sr-only"}`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-secondary-normal/10 p-2">
        <LoadingOverlay loading={loggingOut}>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Log out"
            title={!isOpen ? "Log Out" : undefined}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-reject-normal p-3 text-xs font-semibold text-white transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reject-normal/60 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LuLogOut className="text-lg" />
            <span className={`${isOpen ? "inline text-sm" : "sr-only"}`}>
              Log Out
            </span>
          </button>
        </LoadingOverlay>
      </div>
    </aside>
  );
}
