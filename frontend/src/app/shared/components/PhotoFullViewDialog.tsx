"use client";

import { useMemo, useState } from "react";
import PhotoFullView from "./PhotoFullView";

type LightboxImageInput =
  | string
  | {
      src: string;
      alt?: string;
      caption?: string;
    };

type PhotoFullViewDialogProps = {
  url?: string;
  images?: LightboxImageInput[];
  children: React.ReactNode;
  startIndex?: number;
  showNavigation?: boolean;
  showIndicator?: boolean;
  loopNavigation?: boolean;
  triggerClassName?: string;
};

export default function PhotoFullViewDialog({
  url,
  children,
  images,
  startIndex = 0,
  showNavigation = true,
  showIndicator = true,
  loopNavigation = true,
  triggerClassName,
}: PhotoFullViewDialogProps) {
  const [open, setOpen] = useState(false);

  const normalizedImages = useMemo(() => {
    if (images && images.length > 0) {
      return images
        .map((image) =>
          typeof image === "string"
            ? {
                src: image,
                alt: "Photo preview",
              }
            : {
                src: image.src,
                alt: image.alt ?? "Photo preview",
                caption: image.caption,
              },
        )
        .filter((image) => Boolean(image.src));
    }

    if (url) {
      return [
        {
          src: url,
          alt: "Photo preview",
        },
      ];
    }

    return [];
  }, [images, url]);

  const safeStartIndex =
    normalizedImages.length > 0
      ? Math.min(Math.max(startIndex, 0), normalizedImages.length - 1)
      : 0;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className={triggerClassName ?? "w-full"}
        onClick={handleOpen}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {children}
      </button>

      {open && normalizedImages.length > 0 ? (
        <PhotoFullView
          images={normalizedImages}
          initialIndex={safeStartIndex}
          onCloseDialog={handleClose}
          showNavigation={showNavigation}
          showIndicator={showIndicator}
          loopNavigation={loopNavigation}
        />
      ) : null}
    </>
  );
}
