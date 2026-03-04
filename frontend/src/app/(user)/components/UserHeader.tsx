"use client";

import { useAppSelector } from "@/lib/hooks";
import ImageMainLogo from "@/app/shared/components/ImageMainLogo";
import HeaderPromptAuth from "@/app/shared/components/HeaderPromptAuth";
import UserSideBar from "./UserSideBar";

export default function UserHeader() {
  const user = useAppSelector((state) => state.users.data);

  if (!user) {
    return <HeaderPromptAuth />;
  }

  return (
    <header className="bg-white shadow-md/30 px-[1rem] py-[0.75rem] md:px-[2rem] lg:px-[3rem] lg:py-[1.25rem]">
      <div className="flex items-center justify-between">
        {/* Sidebar - Left */}
        <UserSideBar />

        {/* Logo - Center */}
        <ImageMainLogo />

        {/* Spacer - Right (to balance the layout) */}
        <div className="w-[2.25rem]" />
      </div>
    </header>
  );
}
