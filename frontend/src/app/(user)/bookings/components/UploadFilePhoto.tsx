"use client";

import { useRef, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { v4 as uuid } from "uuid";
import {
  BookingPhotoFileSchema,
  BookingSchema,
} from "../schema/bookings.schema";
import Image from "next/image";
import { IoIosCloseCircle } from "react-icons/io";
import PhotoFullView from "@/app/shared/components/PhotoFullView";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import { Controller, useFormContext } from "react-hook-form";

interface IUploadFilePhoto {
  uploadTextContent?: string;
  onSelectPhoto: (photoFile: BookingPhotoFileSchema) => void;
  onDeletePhoto: () => void;
  url: string | undefined;
  fieldName: any;
}

export default function UploadFilePhoto({
  uploadTextContent = "Upload",
  onSelectPhoto,
  onDeletePhoto,
  url,
  fieldName,
}: IUploadFilePhoto) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFullView, setPhotoFullView] = useState(false);

  const { control } = useFormContext<BookingSchema>();

  const handleOpenFullView = () => {
    setPhotoFullView(true);
  };
  const handleCloseFullView = () => {
    setPhotoFullView(false);
  };
  return (
    <div>
      {url ? (
        <div className="w-full border-2 border-secondary-normal/30 rounded-lg py-[0.25rem] mt-[0.5rem] h-[8rem] lg:h-[12rem]">
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative rounded-lg w-[40%] h-full">
              <button type="button" onClick={handleOpenFullView}>
                <Image
                  src={url}
                  fill
                  className="object-cover object-center"
                  alt="Amihan Staycaion file upload image for booking"
                  sizes="(min-width: 1024px) 320px, 40vw"
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(url);
                  onDeletePhoto();
                }}
              >
                <span className="w-max h-max text-lg absolute text-reject-normal top-0 right-0 translate-y-[-50%] translate-x-[50%] bg-white rounded-full ">
                  <IoIosCloseCircle />
                </span>
              </button>
            </div>
          </div>
          <DialogBaseContent
            onCloseDialog={handleCloseFullView}
            openDialog={photoFullView}
            enableClickOutside={true}
          >
            <PhotoFullView photoSrc={url} onCloseDialog={handleCloseFullView} />
          </DialogBaseContent>
        </div>
      ) : (
        <div>
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => {
              return (
                <button
                  ref={field.ref}
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="w-full border-2 border-secondary-normal/30 rounded-lg p-[0.75rem] mt-[0.5rem] h-[8rem] lg:h-[12rem]"
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
              );
            }}
          />

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp, image/avif"
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
