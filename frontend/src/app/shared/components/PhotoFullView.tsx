"use client";

import Image from "next/image";
import { IoMdClose } from "react-icons/io";

export default function PhotoFullView({
  photoSrc,
  onCloseDialog,
}: {
  photoSrc: string;
  onCloseDialog: () => void;
}) {
  return (
    <div className="w-full flex items-center justify-center bg-[#252424] relative py-[4rem]">
      <button
        type="button"
        onClick={onCloseDialog}
        className="absolute top-5 right-2"
      >
        <span className="text-white text-xl">
          <IoMdClose />
        </span>
      </button>
      <div className="w-full relative h-[20rem] ">
        {photoSrc ? (
          <Image
            src={photoSrc}
            fill
            alt="Amihan Staycation Active View Unit Image Full View"
            className="object-contain object-center rounded-lg"
          />
        ) : null}
      </div>
    </div>
  );
}
