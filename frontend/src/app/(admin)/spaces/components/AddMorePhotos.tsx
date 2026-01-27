"use client";

import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { IoMdAdd } from "react-icons/io";
import { NewUnitSchema } from "../lib/newUnitSchema";
import { v4 as uuid } from "uuid";

export default function AddMorePhotos() {
  const { getValues, setValue } = useFormContext<NewUnitSchema>();

  const morePhotosRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div className="flex items-center justify-center mt-[1rem]">
        <div className="w-[80%]">
          <PrimaryButton
            onClick={() => {
              morePhotosRef.current?.click();
            }}
          >
            <div className="flex items-center py-[0.25rem] gap-x-1">
              <span className="text-lg">
                <IoMdAdd />
              </span>
              <span className="text-xs">Add new</span>
            </div>
          </PrimaryButton>
        </div>
      </div>
      <input
        ref={morePhotosRef}
        type="file"
        multiple
        hidden
        accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
        onChange={(e) => {
          if (!e.target.files) return;

          const newPhotoFiles = Array.from(e.target.files);

          const currentUnitPhotos = getValues("photos");

          const newPhotos = newPhotoFiles.map((newPhotoFile) => ({
            file: newPhotoFile,
            src: URL.createObjectURL(newPhotoFile),
            id: uuid(),
          }));

          setValue("photos", [...currentUnitPhotos, ...newPhotos]);

          e.target.value = "";
        }}
      />
    </div>
  );
}
