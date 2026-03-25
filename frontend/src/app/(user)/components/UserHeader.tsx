"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import ImageMainLogo from "@/app/shared/components/ImageMainLogo";
import HeaderPromptAuth from "@/app/shared/components/HeaderPromptAuth";
import UserSideBar from "./UserSideBar";
import Notification from "./Notification";
import { logout } from "@/app/(user)/api/logout";
import { resetUser } from "@/lib/features/users/usersSlice";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import { IoMdPerson } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";

export default function UserHeader() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.data);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;

      if (!profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();

      await fetch("/api/auth/clear-cookies", {
        method: "DELETE",
      });

      dispatch(resetUser());
      router.replace("/sign-in");
    } catch (err) {
      CustomToast.show(errorHandler(err).message, { indicator: "error" });
    }
  };

  const isNavItemActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (!user) {
    return <HeaderPromptAuth />;
  }

  return (
    <header className="bg-white shadow-md/30 px-[1rem] py-[0.75rem] md:px-[2rem] lg:px-[3rem] lg:py-[1.25rem]">
      <div className="flex items-center justify-between lg:hidden">
        <UserSideBar />

        <ImageMainLogo />

        <Notification />
      </div>

      <div className="hidden items-center gap-8 lg:flex">
        <div className="shrink-0">
          <ImageMainLogo />
        </div>

        <div className="ml-auto flex items-center gap-5 xl:gap-7">
          <nav aria-label="User navigation" className="lg:mr-[3rem]">
            <ul className="flex items-center gap-2 xl:gap-3">
              <li>
                <Link
                  href="/units"
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors xl:text-base ${
                    isNavItemActive("/units")
                      ? "text-primary-normal"
                      : "hover:bg-primary-normal/10"
                  }`}
                >
                  Units
                </Link>
              </li>
              <li>
                <Link
                  href="/my-bookings-history"
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors xl:text-base ${
                    isNavItemActive("/my-bookings-history")
                      ? "text-primary-normal"
                      : "hover:bg-primary-normal/10"
                  }`}
                >
                  My Bookings
                </Link>
              </li>
            </ul>
          </nav>

          <Notification />

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              aria-label="Toggle profile menu"
              className="cursor-pointer"
            >
              {user?.avatar_url ? (
                <div className="relative h-[2.5rem] w-[2.5rem] overflow-hidden rounded-full border-2 border-gray-300">
                  <Image
                    src={user.avatar_url}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-full border-2 border-gray-300">
                  <IoMdPerson className="text-2xl text-gray-500" />
                </div>
              )}
            </button>

            {isProfileMenuOpen ? (
              <div className="absolute right-0 top-[calc(100%+0.6rem)] z-20 w-[13rem] rounded-lg border border-secondary-normal/15 bg-white p-3 shadow-xl">
                <Link
                  href="/profile"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="block text-sm text-secondary-normal underline underline-offset-2 hover-animation lg:hover:opacity-80"
                >
                  View profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-reject-normal py-2 font-bold text-white hover-animation lg:hover:opacity-80"
                >
                  <LuLogOut className="text-base" />
                  <span className="text-sm">Log Out</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
