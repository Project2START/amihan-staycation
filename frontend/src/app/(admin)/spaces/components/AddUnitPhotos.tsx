"use client";

import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { MdOutlineFileUpload } from "react-icons/md";
import { NewUnitSchema } from "../lib/newUnitSchema";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import UnitPhotos from "./UnitPhotos";
import { v4 as uuid } from "uuid";

export default function AddUnitPhotos() {
  const [openUnitPhotos, setOpenUnitPhotos] = useState<boolean>(false);

  const {
    getValues,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<NewUnitSchema>();

  const photos = watch("photos") ?? [];

  const inputPhotosRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef(photos);

  const handleOpenUnitPhotos = () => {
    setOpenUnitPhotos(true);
  };
  const handleCloseUnitPhotos = () => {
    setOpenUnitPhotos(false);
  };

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => {
        URL.revokeObjectURL(photo.src);
      });
    };
  }, []);

  return (
    <div className="flex flex-col ">
      <span className="font-bold">Unit Photos</span>
      <button
        type="button"
        onClick={() => {
          if (getValues("photos").length === 0) {
            inputPhotosRef.current?.click();
          } else {
            handleOpenUnitPhotos();
          }
        }}
        className="border-2 border-secondary-normal/30 rounded-lg p-[0.75rem] mt-[0.5rem] h-[7rem] lg:h-[10rem]"
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex items-center gap-x-2 opacity-50">
            <span className="text-lg">
              <MdOutlineFileUpload />
            </span>
            <span className="font-bold">
              {photos.length > 0
                ? photos.length === 1
                  ? `${photos.length} photo`
                  : `${photos.length} photos`
                : "Upload"}
            </span>
          </div>
        </div>
      </button>
      {errors.photos && (
        <p className="text-red-900 text-[0.65rem]" id="unitPhotos-error">
          {errors.photos.message}
        </p>
      )}
      <input
        ref={inputPhotosRef}
        type="file"
        multiple
        hidden
        accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
        onChange={(e) => {
          if (!e.target.files) return;

          const photoFiles = Array.from(e.target.files);

          const photos = photoFiles.map((photoFile) => ({
            file: photoFile,
            src: URL.createObjectURL(photoFile),
            id: uuid(),
          }));

          setValue("photos", photos);

          e.target.value = "";

          handleOpenUnitPhotos();
        }}
      />

      <DialogBaseContent
        onCloseDialog={handleCloseUnitPhotos}
        enableClickOutside={false}
        openDialog={openUnitPhotos}
      >
        <UnitPhotos onCloseDialog={handleCloseUnitPhotos} />
      </DialogBaseContent>
    </div>
  );
}
