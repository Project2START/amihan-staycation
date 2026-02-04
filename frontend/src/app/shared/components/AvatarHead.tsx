"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { IoMdPerson } from "react-icons/io";
import ClickOutside from "../ui/ClickOutside";
import Link from "next/link";
import { Button } from "@mui/material";
import { LuLogOut } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "../api/logout";
import { resetUser } from "@/lib/features/users/usersSlice";
import { useRouter } from "next/navigation";
import { CustomToast } from "../ui/CustomToast";
import { errorHandler } from "../lib/errorHandler";

export default function AvatarHead() {
  const [avatarMenu, setAvatarMenu] = useState<boolean>(false);

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
  return (
    <div className="flex flex-col items-center relative">
      <button disabled={avatarMenu} onClick={() => setAvatarMenu(true)}>
        {user?.avatar_url ? (
          <div></div>
        ) : (
          <div className="rounded-full border-2 border-gray-300 div-[0.5rem] p-[0.5rem]">
            <span className="text-gray-500 text-xl">
              <IoMdPerson />
            </span>
          </div>
        )}
      </button>

      <AnimatePresence initial={false}>
        {avatarMenu && (
          <motion.div
            initial={{ opacity: 0, translateY: "-5%" }}
            animate={{ opacity: 1, translateY: "0%" }}
            exit={{ opacity: 0, translateY: "-5%" }}
            className="w-[12.5rem] h-max-content bg-white rounded-lg shadow-lg/30 text-xs absolute top-[110%] left-0 z-99"
          >
            <ClickOutside onClickOutside={() => setAvatarMenu(false)}>
              <div>
                <div className="p-[1rem]">
                  <span className="font-bold text-sm">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <br />
                  <span className="block text-gray-500 mt-[0.15rem]">
                    <Link href={"/profile"} className="underline">
                      View profile
                    </Link>
                  </span>
                </div>

                <div>
                  <Button
                    sx={{
                      textTransform: "none",
                      fontSize: "0.75rem",
                    }}
                    color="inherit"
                    variant="contained"
                    fullWidth
                    onClick={handleLogout}
                  >
                    <div className="flex items-center gap-x-2">
                      <span className="text-red-900">
                        <LuLogOut />
                      </span>
                      <span className="text-red-900 font-bold">Log out</span>
                    </div>
                  </Button>
                </div>
              </div>
            </ClickOutside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
