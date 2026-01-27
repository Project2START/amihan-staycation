"use client";

import Image from "next/image";
import UnitImagesDraggable from "./UnitImagesDraggable";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { NewUnitSchema } from "../lib/newUnitSchema";
import PhotoViewActions from "./PhotoViewActions";

export default function UnitPhotosView() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const { watch, setValue } = useFormContext<NewUnitSchema>();

  const photos = watch("photos");

  useEffect(() => {
    if (!activeImage && photos.length) {
      setActiveImage(photos[0].id);
    } else if (!photos.length) {
      setActiveImage(null);
    }
  }, [photos, activeImage]);

  const activeImgSrc = photos.find((photo) => photo.id === activeImage);

  return (
    <div className="bg-[#efefef] rounded-lg">
      <div className="w-full relative h-[10.5rem]">
        {activeImgSrc && (
          <>
            <PhotoViewActions
              photoSrc={activeImgSrc.src}
              photoId={activeImgSrc.id}
              onNewActiveImage={(id) => setActiveImage(id)}
            />
            <Image
              src={activeImgSrc.src}
              fill
              alt="Amihan Staycation Active View Unit Image"
              className="object-cover object-center rounded-lg"
            />
          </>
        )}
      </div>
      <UnitImagesDraggable
        activeImage={activeImage}
        sources={photos}
        onHandleActiveImage={(id) => setActiveImage(id)}
        onSetSources={(movedArray) => {
          setTimeout(() => {
            setValue("photos", movedArray);
          });
        }}
      />
    </div>
  );
}
