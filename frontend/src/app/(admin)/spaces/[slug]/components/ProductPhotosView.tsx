"use client";

import { useEffect, useState } from "react";
import UnitImagesDraggable from "../../components/UnitImagesDraggable";
import { IProductPhoto } from "@/app/shared/components/ProductItem";
import Image from "next/image";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import PhotoFullView from "@/app/shared/components/PhotoFullView";
import { MdOpenInFull } from "react-icons/md";

export default function ProductPhotosView({
  photos,
}: {
  photos: IProductPhoto[];
}) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [fullView, setFullView] = useState(false);

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
      <div className="w-full relative h-[13.5rem]">
        {activeImgSrc && (
          <>
            <div className="w-full h-[2rem] absolute top-0 left-0 z-10 bg-gradient-to-b from-[rgb(0,0,0)] to-[rgba(0,0,0, 0.75)]">
              <div className="px-[0.5rem] flex justify-end items-center h-full">
                <button type="button" onClick={() => setFullView(true)}>
                  <span className="text-white text-base">
                    <MdOpenInFull />
                  </span>
                </button>
              </div>
              <DialogBaseContent
                onCloseDialog={() => setFullView(false)}
                openDialog={fullView}
                enableClickOutside={true}
              >
                <PhotoFullView
                  photoSrc={activeImgSrc.image_url}
                  onCloseDialog={() => setFullView(false)}
                />
              </DialogBaseContent>
            </div>
            <Image
              src={activeImgSrc.image_url}
              fill
              alt="Amihan Staycation Active View Unit Image"
              className="object-cover object-center rounded-lg"
            />
          </>
        )}
      </div>
      <UnitImagesDraggable
        activeImage={activeImage}
        sources={photos.map((photo) => ({
          id: photo.id,
          src: photo.image_url,
        }))}
        onHandleActiveImage={(id) => setActiveImage(id)}
        enableDrag={false}
      />
    </div>
  );
}
