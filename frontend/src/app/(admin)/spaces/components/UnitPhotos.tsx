"use client";

import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import { useFormContext } from "react-hook-form";
import { NewUnitSchema } from "../lib/newUnitSchema";
import UnitPhotosView from "./UnitPhotosView";
import AddMorePhotos from "./AddMorePhotos";

interface IUnitPhotosProps {
  onCloseDialog: () => void;
}

export default function UnitPhotos({ onCloseDialog }: IUnitPhotosProps) {
  const { watch } = useFormContext<NewUnitSchema>();

  const photos = watch("photos");

  return (
    <div className="px-[1.5rem] pt-[2rem] pb-[1.5rem]">
      <div className="relative mb-[1rem]">
        <div className="vertical_center">
          <PrimaryBackButton onClick={onCloseDialog} style="text-lg" />
        </div>
        <h1 className="text-center text-xl font-bold">Unit Photos</h1>
        <p className="px-[0.25rem] py-[0.5rem] absolute top-[50%] translate-y-[-50%] right-0">
          {photos.length > 0
            ? photos.length === 1
              ? `${photos.length} photo`
              : `${photos.length} photos`
            : "No photos"}
        </p>
      </div>

      <UnitPhotosView />

      <AddMorePhotos />
    </div>
  );
}
