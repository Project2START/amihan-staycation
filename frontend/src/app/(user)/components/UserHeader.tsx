"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IoMdPerson } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { resetUser } from "@/lib/features/users/usersSlice";
import { logout } from "@/app/(user)/api/logout";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import ImageMainLogo from "@/app/shared/components/ImageMainLogo";
import HeaderPromptAuth from "@/app/shared/components/HeaderPromptAuth";
import ClickOutside from "@/app/shared/ui/ClickOutside";

export default function UserHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.data);

  if (!user) {
    return <HeaderPromptAuth />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(resetUser());
      router.replace("/sign-in");
    } catch (err) {
      CustomToast.show(errorHandler(err).message, { indicator: "error" });
    }
  };

  return (
    <header className="bg-white shadow-md/30 px-[1rem] py-[0.75rem] md:px-[2rem] lg:px-[3rem] lg:py-[1.25rem]">
      <div className="relative flex items-center justify-center">
        {/* Profile Avatar - Left */}
        <div className="absolute left-0 flex flex-col items-start">
          <button
            disabled={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="cursor-pointer"
          >
            {user.avatar_url ? (
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

          {/* Dropdown Menu */}
          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, translateY: "-5%" }}
                animate={{ opacity: 1, translateY: "0%" }}
                exit={{ opacity: 0, translateY: "-5%" }}
                className="absolute top-[120%] left-0 w-[13rem] bg-white rounded-lg shadow-lg/30 z-50 overflow-hidden"
              >
                <ClickOutside onClickOutside={() => setMenuOpen(false)}>
                  <div className="flex flex-col">
                    {/* User Info */}
                    <div className="p-[1rem]">
                      <span className="font-bold text-sm block">
                        {user.first_name} {user.last_name}
                      </span>
                      <Link
                        href="/profile"
                        className="text-gray-500 text-xs underline mt-[0.25rem] inline-block"
                      >
                        View profile
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full bg-reject-normal text-white py-[0.5rem] cursor-pointer hover:opacity-90 transition"
                    >
                      <div className="flex items-center justify-center gap-x-2">
                        <span className="text-lg">
                          <LuLogOut />
                        </span>
                        <span className="text-xs font-bold">Log out</span>
                      </div>
                    </button>
                  </div>
                </ClickOutside>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logo - Center */}
        <ImageMainLogo />
      </div>
    </header>
  );
}
