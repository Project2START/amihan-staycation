"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { IoMdPerson } from "react-icons/io";
import ClickOutside from "../ui/ClickOutside";
import Link from "next/link";
import { Button } from "@mui/material";
import { LuLogOut } from "react-icons/lu";

export default function AvatarHead() {
  const [avatarMenu, setAvatarMenu] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center relative">
      <button disabled={avatarMenu} onClick={() => setAvatarMenu(true)}>
        <div className="rounded-full border-2 border-gray-300 p-[0.5rem]">
          <span className="text-gray-500 text-xl">
            <IoMdPerson />
          </span>
        </div>
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
              <div className="p-[1rem]">
                <div>
                  <span className="font-bold text-sm">Nathaniel Andoy</span>
                  <br />
                  <span className="block text-gray-500 mt-[0.15rem]">
                    <Link href={"/profile"} className="underline">
                      View profile
                    </Link>
                  </span>
                </div>

                <div className="mt-[1rem]">
                  <Button
                    sx={{
                      textTransform: "none",
                      fontSize: "0.75rem",
                    }}
                    color="inherit"
                    variant="contained"
                    fullWidth
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
