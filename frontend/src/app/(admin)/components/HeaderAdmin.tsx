"use client";

import ImageMainLogo from "../../shared/components/ImageMainLogo";
import HeaderSideBar from "./HeaderSideBar";

export default function HeaderAdmin() {
  return (
    <div>
      <div className="flex h-[72px] items-center justify-between bg-white px-[1rem] py-[0.75rem] shadow-lg/30 lg:px-[1.25rem]">
        <div className="flex items-center">
          <div className="lg:hidden">
            <HeaderSideBar />
          </div>
        </div>
        <ImageMainLogo />
        <div className="w-10" aria-hidden="true"></div>
      </div>
    </div>
  );
}
