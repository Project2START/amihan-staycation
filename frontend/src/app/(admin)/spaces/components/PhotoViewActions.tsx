"use client";

import { TbReplace } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOpenInFull } from "react-icons/md";
import { useFormContext } from "react-hook-form";
import { NewUnitSchema } from "../lib/newUnitSchema";
import { useRef } from "react";

export default function PhotoViewActions({
  photoId,
  onNewActiveImage,
}: {
  photoId: string;
  onNewActiveImage: (id: string) => void;
}) {
  const replaceInputRef = useRef<null | HTMLInputElement>(null);

  const { getValues, setValue } = useFormContext<NewUnitSchema>();

  const handleUpdatePhoto = (file: File) => {
    const photos = getValues("photos");

    const newPhotos = photos.map((photo) => {
      if (photo.id === photoId) {
        return { ...photo, photo: file };
      }
      return photo;
    });

    setValue("photos", newPhotos, {
      shouldValidate: true,
    });
  };

  const handleDeletePhoto = () => {
    const photos = getValues("photos");
    const photoIndex = photos.findIndex((photo) => photo.id === photoId);

    const newPhotos = photos.filter((photo) => photo.id !== photoId);
    setValue("photos", newPhotos, { shouldValidate: true });

    let newActiveId: string | null = null;

    if (photoIndex > 0) {
      newActiveId = photos[photoIndex - 1].id;
    } else if (photoIndex < photos.length - 1) {
      newActiveId = photos[photoIndex + 1].id;
    }

    if (newActiveId) {
      onNewActiveImage(newActiveId);
    }
  };

  return (
    <div className="w-full h-[2rem] absolute top-0 left-0 z-10 bg-gradient-to-b from-[rgb(0,0,0)] to-[rgba(0,0,0, 0.75)]">
      <div className="flex items-center justify-end h-full px-[0.5rem]">
        <div className="flex gap-x-3">
          <button
            type="button"
            onClick={() => {
              if (!replaceInputRef.current) return;

              replaceInputRef.current.click();
            }}
          >
            <span className="text-white text-base">
              <TbReplace />
            </span>
            <input
              ref={replaceInputRef}
              type="file"
              hidden
              accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                handleUpdatePhoto(file);
              }}
            />
          </button>
          <button type="button" onClick={handleDeletePhoto}>
            <span className="text-white text-base">
              <RiDeleteBin6Line />
            </span>
          </button>
          <button type="button">
            <span className="text-white text-base">
              <MdOpenInFull />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
