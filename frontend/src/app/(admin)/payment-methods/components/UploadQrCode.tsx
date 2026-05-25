"use client";

import { useRef, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { v4 as uuid } from "uuid";
import {
  AddPaymentMethodSchema,
  QrCodePhotoSchema,
} from "../schema/addPaymentMethod.schema";
import Image from "next/image";
import { IoIosCloseCircle } from "react-icons/io";
import PhotoFullView from "@/app/shared/components/PhotoFullView";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import { Controller, useFormContext } from "react-hook-form";

export default function UploadQrCode() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFullView, setPhotoFullView] = useState(false);

  const { control, watch, setValue, clearErrors, unregister } =
    useFormContext<AddPaymentMethodSchema>();

  const qrCode = watch("qr_code");
  const url = qrCode?.url;

  const handleOpenFullView = () => {
    setPhotoFullView(true);
  };

  const handleCloseFullView = () => {
    setPhotoFullView(false);
  };

  const handleSelectPhoto = (photoFile: QrCodePhotoSchema) => {
    setValue("qr_code", photoFile);
    clearErrors("qr_code");
  };

  const handleDeletePhoto = () => {
    unregister("qr_code");
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
                  alt="QR code image"
                  sizes="(min-width: 1024px) 320px, 40vw"
                />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  URL.revokeObjectURL(url);
                  handleDeletePhoto();
                }}
              >
                <span className="w-max h-max text-lg absolute text-reject-normal top-0 right-0 translate-y-[-50%] translate-x-[50%] bg-white rounded-full">
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
            name="qr_code"
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
                      <span className="font-bold">Upload QR Code</span>
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

              const photoSchemaValue: QrCodePhotoSchema = {
                file,
                url: URL.createObjectURL(file),
                id: uuid(),
              };

              handleSelectPhoto(photoSchemaValue);

              e.target.value = "";
            }}
          />
        </div>
      )}
    </div>
  );
}
