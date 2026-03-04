"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { logout } from "@/app/(user)/api/logout";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { resetUser } from "@/lib/features/users/usersSlice";
import { useRouter } from "next/navigation";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import { LuLogOut } from "react-icons/lu";
import Link from "next/link";
import { IoMdPerson } from "react-icons/io";
import { MdHistory } from "react-icons/md";
import type { IconType } from "react-icons";

interface NavItem {
  label: string;
  href: string;
  icon: IconType;
}

const navItems: NavItem[] = [
  {
    label: "My Bookings",
    href: "/my-bookings-history",
    icon: MdHistory,
  },
];

export default function UserSideBar() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.data);

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(resetUser());
      router.replace("/sign-in");
    } catch (err) {
      CustomToast.show(errorHandler(err).message, { indicator: "error" });
    }
  };

  const pathname = usePathname();

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer"
        aria-label="Open sidebar"
      >
        {user?.avatar_url ? (
          <div className="relative w-[2.25rem] h-[2.25rem] rounded-full overflow-hidden border-2 border-gray-300">
            <Image
              src={user.avatar_url}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-[2.25rem] h-[2.25rem] rounded-full border-2 border-gray-300">
            <IoMdPerson className="text-gray-500 text-xl" />
          </div>
        )}
      </button>

      {/* Overlay + Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-1000"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          >
            {/* Dark overlay covering entire screen */}
            <div className="absolute inset-0 bg-black/50" />

            {/* White navigation container */}
            <motion.div
              className="relative h-full w-[280px] bg-white shadow-lg flex flex-col text-xs text-secondary-normal"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Logo section */}
              <div className="flex justify-center items-center bg-secondary-normal py-3">
                <div className="relative w-8 h-8 rounded-full bg-white overflow-hidden">
                  <Image
                    src="/images/amihan-staycation-mainLogo.png"
                    alt="Amihan Staycation main logo"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-[0.5rem]">
                <div>
                  <div className="flex gap-x-3 items-center border-b-2 border-secondary-normal/30 pb-[1rem]">
                    {user?.avatar_url ? (
                      <div className="relative w-[3rem] h-[3rem] rounded-full overflow-hidden border-2 border-gray-300">
                        <Image
                          src={user.avatar_url}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-[3rem] h-[3rem] rounded-full border-2 border-gray-300 p-[0.5rem]">
                        <span className="text-gray-500 text-xl">
                          <IoMdPerson />
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">
                        {user?.first_name} {user?.last_name}
                      </span>
                      <span className="text-gray-500">
                        <Link
                          href="/profile"
                          onClick={() => setIsOpen(false)}
                          className="underline"
                        >
                          View profile
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation list */}
                <nav className="mt-4">
                  <ul className="flex flex-col gap-y-1">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            onClick={() => setIsOpen(false)}
                            href={item.href}
                            className={`flex items-center gap-x-5 px-3 py-3 hover:bg-gray-100 transition-colors border-b-1 border-secondary-normal/10 ${isActive ? "font-bold text-secondary-normal" : ""}`}
                          >
                            <item.icon
                              className={`text-xl ${isActive ? "text-secondary-normal" : "text-secondary-normal/50"}`}
                            />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>

              {/* Logout button */}
              <div className="p-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-x-3 font-bold w-full py-3 bg-reject-normal text-white rounded-lg cursor-pointer"
                >
                  <span className="text-lg">
                    <LuLogOut />
                  </span>
                  <span className="font-bold">Log Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
