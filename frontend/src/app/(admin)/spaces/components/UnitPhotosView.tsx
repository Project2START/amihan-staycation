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
    setActiveImage(sources.length !== 0 ? sources[0].src : "");
  }, [sources]);

  return (
    <div className="bg-[#efefef] rounded-lg">
      <div className="full relative h-[9.5rem]">
        {activeImage && (
          <Image
            src={activeImage}
            fill
            alt="Amihan Staycation Active View Unit Image"
            className="object-cover object-center rounded-lg"
          />
        )}
      </div>
      <div className="w-full overflow-x-auto">
        <UnitImagesDraggable
          //   sources={sources.map((source) => ({
          //     src: source.src,
          //     id: source.src,
          //   }))}
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
    </div>
  );
}
