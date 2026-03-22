"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { createPortal } from "react-dom";

type LightboxImage = {
  src: string;
  alt?: string;
  caption?: string;
};

type PhotoFullViewProps = {
  images?: LightboxImage[];
  photoSrc?: string;
  initialIndex?: number;
  onCloseDialog: () => void;
  showNavigation?: boolean;
  showIndicator?: boolean;
  loopNavigation?: boolean;
};

export default function PhotoFullView({
  images,
  photoSrc,
  initialIndex = 0,
  onCloseDialog,
  showNavigation = true,
  showIndicator = true,
  loopNavigation = true,
}: PhotoFullViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageLoaded, setImageLoaded] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const normalizedImages = useMemo(() => {
    if (images && images.length > 0) {
      return images.filter((image) => Boolean(image?.src));
    }

    if (photoSrc) {
      return [
        {
          src: photoSrc,
          alt: "Photo preview",
        },
      ];
    }

    return [];
  }, [images, photoSrc]);

  const canNavigate = showNavigation && normalizedImages.length > 1;

  const activeImage = useMemo(() => {
    if (normalizedImages.length === 0) {
      return null;
    }

    const boundedIndex = Math.min(
      Math.max(currentIndex, 0),
      normalizedImages.length - 1,
    );
    return normalizedImages[boundedIndex];
  }, [currentIndex, normalizedImages]);

  const goToPrevious = () => {
    if (!canNavigate) {
      return;
    }

    setCurrentIndex((prev) => {
      if (prev === 0) {
        return loopNavigation ? normalizedImages.length - 1 : 0;
      }

      return prev - 1;
    });
  };

  const goToNext = () => {
    if (!canNavigate) {
      return;
    }

    setCurrentIndex((prev) => {
      if (prev === normalizedImages.length - 1) {
        return loopNavigation ? 0 : normalizedImages.length - 1;
      }

      return prev + 1;
    });
  };

  useEffect(() => {
    setCurrentIndex(
      Math.min(
        Math.max(initialIndex, 0),
        Math.max(normalizedImages.length - 1, 0),
      ),
    );
  }, [normalizedImages.length, initialIndex]);

  useEffect(() => {
    setImageLoaded(false);
  }, [activeImage?.src]);

  useEffect(() => {
    setIsMounted(true);
    const animationFrame = window.requestAnimationFrame(() =>
      setIsVisible(true),
    );

    return () => {
      window.cancelAnimationFrame(animationFrame);
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseDialog();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const modalNode = modalRef.current;
      if (!modalNode) {
        event.preventDefault();
        return;
      }

      const focusableElements = Array.from(
        modalNode.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) =>
          !element.hasAttribute("disabled") && element.tabIndex !== -1,
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (activeElement === firstElement || !activeElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [goToNext, goToPrevious, onCloseDialog]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCloseDialog();
    }
  };

  if (!isMounted || !activeImage) {
    return null;
  }

  return createPortal(
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/90 p-3 backdrop-blur-[2px] sm:p-6"
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        onClick={onCloseDialog}
        ref={closeButtonRef}
        className="absolute right-3 top-3 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-[0_8px_18px_rgba(0,0,0,0.45)] transition hover:scale-105 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:right-5 sm:top-5"
        aria-label="Close photo viewer"
      >
        <span className="text-2xl">
          <IoMdClose />
        </span>
      </button>

      {canNavigate ? (
        <button
          type="button"
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 z-30 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white shadow-[0_8px_18px_rgba(0,0,0,0.45)] transition hover:scale-105 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:left-5"
          aria-label="Show previous image"
        >
          <IoChevronBack className="text-2xl" />
        </button>
      ) : null}

      {canNavigate ? (
        <button
          type="button"
          onClick={goToNext}
          className="absolute right-3 top-1/2 z-30 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white shadow-[0_8px_18px_rgba(0,0,0,0.45)] transition hover:scale-105 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:right-5"
          aria-label="Show next image"
        >
          <IoChevronForward className="text-2xl" />
        </button>
      ) : null}

      <div
        className={`relative z-20 flex h-[72vh] w-full max-w-[95vw] items-center justify-center transition-all duration-300 ease-out sm:h-[82vh] sm:max-w-[90vw] md:max-w-5xl lg:max-w-6xl ${
          isVisible ? "scale-100 opacity-100" : "scale-[0.98] opacity-0"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          key={activeImage.src}
          className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-black/35 shadow-[0_28px_70px_rgba(0,0,0,0.6),0_0_60px_rgba(255,255,255,0.08)]"
        >
          {!imageLoaded ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 backdrop-blur-sm">
              <span
                className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"
                aria-label="Loading image"
              />
            </div>
          ) : null}

          <Image
            src={activeImage.src}
            fill
            alt={activeImage.alt ?? "Photo preview"}
            className={`object-contain object-center transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            sizes="100vw"
            priority
            onLoad={() => setImageLoaded(true)}
          />

          {showIndicator ? (
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-black/55 px-4 py-1.5 text-xs font-medium tracking-wide text-white/90 shadow-[0_6px_20px_rgba(0,0,0,0.45)] sm:bottom-4 sm:text-sm">
              {activeImage.caption ? (
                <span className="mr-2 text-white/80">
                  {activeImage.caption}
                </span>
              ) : null}
              <span>
                {currentIndex + 1} / {normalizedImages.length}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
