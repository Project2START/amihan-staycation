"use client";

import ImageMainLogo from "@/app/components/ImageMainLogo";

export default function AuthHeader() {
  return (
    <div className="shadow-md/30 bg-white py-[0.75rem]">
      <div className="flex justify-center">
        <ImageMainLogo />
      </div>
    </div>
  );
}
