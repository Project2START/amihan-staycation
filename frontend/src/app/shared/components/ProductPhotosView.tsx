"use client";

import { useEffect, useState } from "react";
import UnitImagesDraggable from "../../(admin)/spaces/components/UnitImagesDraggable";
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

  const activeImgSrc = photos.find((photo) => photo.id === activeImage);

  const photoIndex = photos.findIndex((photo) => photo.id === activeImage);

  useEffect(() => {
    if (!activeImage && photos.length) {
      setActiveImage(photos[0].id);
    } else if (!photos.length) {
      setActiveImage(null);
    } else if (!activeImgSrc) {
      setActiveImage(photos[0].id);
    }
  }, [photos, activeImage, activeImgSrc]);

  return (
    <div className="bg-[#efefef] rounded-lg">
      <div className="w-full relative h-[13.5rem] lg:h-[25rem]">
        {activeImgSrc && (
          <>
            <div className="px-[0.25rem] py-[0.75rem] flex justify-between items-center w-full h-[2rem] absolute top-0 left-0 z-10 bg-gradient-to-b from-[rgb(0,0,0)] to-[rgba(0,0,0, 0.75)]">
              <div className="ml-[0.5rem]">
                <span className="text-white text-xs">
                  {photoIndex + 1} / {photos.length}
                </span>
              </div>
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
                  key={activeImage ?? "photo-full-view"}
                  photoSrc={activeImgSrc.image_url}
                  initialIndex={Math.max(photoIndex, 0)}
                  onCloseDialog={() => setFullView(false)}
                  images={photos.map((photo) => ({
                    src: photo.image_url,
                    alt: photo.alt,
                  }))}
                />
              </DialogBaseContent>
            </div>
            <Image
              src={activeImgSrc.image_url}
              fill
              alt="Amihan Staycation Active View Unit Image"
              className="object-cover object-center rounded-lg"
              sizes="(min-width: 1280px) 720px, (min-width: 1024px) 600px, (min-width: 768px) 90vw, 100vw"
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
