"use client";

import PrimaryBackButton from "@/app/shared/ui/PrimaryBackButton";
import { useFormContext } from "react-hook-form";
import { NewUnitSchema } from "../lib/newUnitSchema";

import { useEffect, useState } from "react";
import UnitPhotosView from "./UnitPhotosView";
import AddMorePhotos from "./AddMorePhotos";

interface IUnitPhotosProps {
  onCloseDialog: () => void;
}

export default function UnitPhotos({ onCloseDialog }: IUnitPhotosProps) {
  const { getValues } = useFormContext<NewUnitSchema>();
  const [sources, setSources] = useState<
    { photo: File; id: string; src: string }[]
  >([]);

  const photos = getValues("photos");

  useEffect(() => {
    if (!photos || photos.length === 0) {
      setSources([]);
      return;
    }

    const mappedPhotos = photos.map((photo) => ({
      photo,
      id: photo.name,
      src: URL.createObjectURL(photo),
    }));

    setSources(mappedPhotos);

    return () => {
      mappedPhotos.forEach((mappedPhoto) => {
        URL.revokeObjectURL(mappedPhoto.src);
      });
    };
  }, [photos]);

  return (
    <div className="px-[1.5rem] pt-[2rem] pb-[1.5rem]">
      <div className="relative mb-[1rem]">
        <div className="vertical_center">
          <PrimaryBackButton onClick={onCloseDialog} style="text-lg" />
        </div>
        <h1 className="text-center text-xl font-bold">Unit Photos</h1>
      </div>

      <UnitPhotosView sources={sources} />

      <AddMorePhotos />

      {/* <div className="bg-[#efefef] rounded-lg">
        <div className="full relative h-[9.5rem]">
          {activeImage && (
            <Image
              src={activeImage}
              fill
              alt="hello"
              className="object-cover object-center rounded-lg"
            />
          )}
        </div>
        <div className="w-full overflow-x-auto">
          <UnitImagesDraggable
            sources={sources}
            onHandleActiveImage={(src) => setActiveImage(src)}
            onSetSources={(movedArray) => {
              setValue(
                "photos",
                movedArray.map((photo) => photo.photo)
              );
            }}
          />
        </div>
      </div> */}
    </div>
  );
}
