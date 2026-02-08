"use client";

import { useRef } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { v4 as uuid } from "uuid";
import { BookingPhotoFileSchema } from "../schema/bookings.schema";
import Image from "next/image";
import { IoIosCloseCircle } from "react-icons/io";

interface IUploadFilePhoto {
  uploadTextContent?: string;
  onSelectPhoto: (photoFile: BookingPhotoFileSchema) => void;
  onDeletePhoto: () => void;
  url: string | undefined;
}

export default function UploadFilePhoto({
  uploadTextContent = "Upload",
  onSelectPhoto,
  onDeletePhoto,
  url,
}: IUploadFilePhoto) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log(url);
  return (
    <div>
      {url ? (
        <div className="w-full border-2 border-secondary-normal/30 rounded-lg px-[0.75rem] mt-[0.5rem] h-[7rem]">
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative rounded-lg w-[30%] h-full">
              <Image
                src={url}
                fill
                className="object-cover object-center"
                alt="Amihan Staycaion file upload image for booking"
                sizes="100%"
              />
              <button type="button" onClick={onDeletePhoto}>
                <span className="text-lg absolute text-reject-normal top-[-0.25rem] right-[-0.25rem]">
                  <IoIosCloseCircle />
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
            className="w-full border-2 border-secondary-normal/30 rounded-lg p-[0.75rem] mt-[0.5rem] h-[7rem]"
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex items-center gap-x-2 opacity-50">
                <span className="text-lg">
                  <MdOutlineFileUpload />
                </span>
                <span className="font-bold">{uploadTextContent}</span>
              </div>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
            onChange={(e) => {
              if (!e.target.files || e.target.files.length === 0) return;

              const file = e.target.files[0];

              const photoSchemaValue = {
                file,
                url: URL.createObjectURL(file),
                id: uuid(),
              };

              onSelectPhoto(photoSchemaValue);

              e.target.value = "";
            }}
          />
        </div>
      )}
    </div>
  );
}
