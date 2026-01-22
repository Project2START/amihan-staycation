"use client";

import Image from "next/image";
import UnitImagesDraggable from "./UnitImagesDraggable";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { NewUnitSchema } from "../lib/newUnitSchema";

export default function UnitPhotosView({
  sources,
}: {
  sources: { photo: File; id: string; src: string }[];
}) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const { setValue } = useFormContext<NewUnitSchema>();

  useEffect(() => {
    if (!activeImage && sources.length) {
      setActiveImage(sources[0].id);
    } else if (!sources.length) {
      setActiveImage(null);
    }
  }, [sources, activeImage]);

  const activeImgSrc = sources.find((source) => source.id === activeImage);

  return (
    <div className="bg-[#efefef] rounded-lg">
      <div className="full relative h-[9.5rem]">
        {activeImgSrc && (
          <Image
            src={activeImgSrc.src}
            fill
            alt="Amihan Staycation Active View Unit Image"
            className="object-cover object-center rounded-lg"
          />
        )}
      </div>
      <div className="w-full overflow-x-auto">
        <UnitImagesDraggable
          activeImage={activeImage}
          sources={sources}
          onHandleActiveImage={(id) => setActiveImage(id)}
          onSetSources={(movedArray) => {
            setValue(
              "photos",
              movedArray.map((photo) => ({ photo: photo.photo, id: photo.id })),
            );
          }}
        />
      </div>
    </div>
  );
}
