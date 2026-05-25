"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  FaBookOpen,
  FaChevronLeft,
  FaChevronRight,
  FaFacebook,
  FaGlobe,
  FaGoogle,
  FaMessage,
  FaQuoteLeft,
  FaRegCircleUser,
  FaStar,
} from "react-icons/fa6";

type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  avatarUrl: string | null;
  rating: number;
  isImported: boolean;
  source: string | null;
  createdAt: string;
  unitName: string;
};

const COMMENT_PREVIEW_LENGTH = 180;

const getItemsPerView = (width: number) => {
  if (width <= 767) return 2;
  if (width <= 1280) return 2;
  if (width <= 1920) return 3;
  return 4;
};

const SOURCE_META: Record<string, { label: string; icon: React.ReactNode }> = {
  GOOGLE: {
    label: "Google",
    icon: <FaGoogle size={16} className="text-[#DB4437]" />,
  },
  FACEBOOK: {
    label: "Facebook",
    icon: <FaFacebook size={16} className="text-[#1877F2]" />,
  },
  DIRECT_MESSAGE: {
    label: "Direct Message",
    icon: <FaMessage size={16} className="text-[#0EA5E9]" />,
  },
  GUESTBOOK: {
    label: "Guestbook",
    icon: <FaBookOpen size={16} className="text-[#A16207]" />,
  },
  OTHER: {
    label: "Other",
    icon: <FaGlobe size={16} className="text-[#0B5173]" />,
  },
};

const getVisibleItems = (
  items: TestimonialItem[],
  page: number,
  itemsPerView: number,
) => {
  if (!items.length) return [];

  const start = page * itemsPerView;
  return items.slice(start, start + itemsPerView);
};

const testimonials: TestimonialItem[] = [
  {
    id: "agatha-moto-2025",
    quote:
      "Staycation in Azure Urban Residences with Boracay vibes. Looking for a peaceful and relaxing place in Parañaque? This is highly recommended.",
    name: "Agatha Moto",
    avatarUrl: "/images/testimonials-profile/testimonial-1.jpg",
    rating: 5,
    isImported: true,
    source: "FACEBOOK",
    createdAt: "2025-09-27T00:00:00.000Z",
    unitName: "Amihan Staycation",
  },

  {
    id: "carlmatthew-2025",
    quote:
      "Very clean and mabango ang room, and super bait ng owner. Cozy and relaxing place, and we will definitely come back.",
    name: "CarlMatthew",
    avatarUrl: "/images/testimonials-profile/testimonial-3.jpg",
    rating: 5,
    isImported: true,
    source: "FACEBOOK",
    createdAt: "2025-09-14T00:00:00.000Z",
    unitName: "Amihan Staycation",
  },
  {
    id: "dan-posas-2026",
    quote:
      "Great staycation experience with a clean and comfortable place that is perfect for relaxation and quality rest during your stay.",
    name: "Dan Posas",
    avatarUrl: "/images/testimonials-profile/testimonial-4.jpg",
    rating: 0,
    isImported: true,
    source: "FACEBOOK",
    createdAt: "2026-01-26T00:00:00.000Z",
    unitName: "Amihan Staycation",
  },

  {
    id: "boss-jay",
    quote:
      "Affordable and beautiful staycation option that is budget-friendly and conveniently located within Metro Manila for easy access.",
    name: "Boss Jay",
    avatarUrl: "/images/testimonials-profile/testimonial-5.jpg",
    rating: 5,
    isImported: true,
    source: "FACEBOOK",
    createdAt: "",
    unitName: "Amihan Staycation",
  },
  {
    id: "patrick-enriquez-2025",
    quote: "Thank you so much for the wonderful stay and warm accommodation.",
    name: "Patrick Enriquez",
    avatarUrl: "/images/testimonials-profile/testimonial-6.jpg",
    rating: 5,
    isImported: true,
    source: "FACEBOOK",
    createdAt: "2025-12-10T00:00:00.000Z",
    unitName: "Amihan Staycation",
  },
  {
    id: "christine-2025",
    quote:
      "Thank you for accommodating us. Great location, and we appreciate the curtains and glass door that help reduce outside noise.",
    name: "Christine",
    avatarUrl: "/images/testimonials-profile/testimonial-2.jpg",
    rating: 5,
    isImported: true,
    source: "FACEBOOK",
    createdAt: "2025-12-30T00:00:00.000Z",
    unitName: "Amihan Staycation",
  },
];

export default function TestimonialsSection() {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(getItemsPerView(window.innerWidth));
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => {
      window.removeEventListener("resize", updateItemsPerView);
    };
  }, []);

  const totalPages = Math.ceil(testimonials.length / itemsPerView);

  const visibleItems = useMemo(
    () => getVisibleItems(testimonials, currentPage, itemsPerView),
    [testimonials, currentPage, itemsPerView],
  );

  useEffect(() => {
    if (totalPages === 0) return;

    if (currentPage > totalPages - 1) {
      setCurrentPage(totalPages - 1);
    }
  }, [currentPage, totalPages]);

  const isPrevDisabled = currentPage <= 0;
  const isNextDisabled = totalPages === 0 || currentPage >= totalPages - 1;

  const onPrev = () => {
    if (isPrevDisabled) return;

    setCurrentPage((prev) => prev - 1);
  };

  const onNext = () => {
    if (isNextDisabled) return;

    setCurrentPage((prev) => prev + 1);
  };

  const onToggleExpanded = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="overflow-hidden rounded-[1.15rem] bg-[#f1f1f1] sm:rounded-[1.3rem] lg:rounded-[1.5rem]">
      <div className="relative overflow-hidden bg-secondary-normal px-4 pb-12 pt-7 text-white sm:px-6 sm:pb-14 md:px-8 md:pb-16 md:pt-8 lg:px-10 lg:pt-10 xl:px-12 xl:pb-[4.5rem] 2xl:px-14 min-[1921px]:px-[4.5rem]">
        <h2 className="text-center text-xl font-bold sm:text-2xl md:text-[1.8rem] lg:text-[2.2rem] xl:text-[2.6rem] 2xl:text-[3rem] min-[1921px]:text-[3.4rem]">
          What Our Guests Say
        </h2>
        <p className="mx-auto mt-2 max-w-[56rem] text-center text-xs font-semibold sm:text-sm md:mt-3 md:text-base lg:text-lg xl:text-xl 2xl:text-2xl min-[1921px]:text-[1.65rem]">
          Real guest stories and feedback on Amihan Staycation&apos;s comfort
          and care.
        </p>

        <div className="pointer-events-none absolute bottom-[-2.6rem] left-[-12%] h-[4.8rem] w-[62%] rounded-[100%] bg-[#f1f1f1] sm:bottom-[-2.9rem] sm:h-[5.4rem] md:bottom-[-3.2rem] md:h-[5.9rem]" />
        <div className="pointer-events-none absolute bottom-[-2.6rem] right-[-12%] h-[4.8rem] w-[62%] rounded-[100%] bg-[#f1f1f1] sm:bottom-[-2.9rem] sm:h-[5.4rem] md:bottom-[-3.2rem] md:h-[5.9rem]" />
      </div>

      <div className="relative px-3 pb-4 pt-1 sm:px-4 sm:pb-6 md:px-8 lg:px-12 lg:pb-8 xl:px-14 2xl:px-16 min-[1921px]:px-20">
        <button
          type="button"
          aria-label="Previous testimonials"
          onClick={onPrev}
          disabled={isPrevDisabled}
          className="absolute -left-1 top-[48%] z-10 -translate-y-1/2 text-secondary-normal transition enabled:hover:text-secondary-normal/70 disabled:cursor-not-allowed disabled:opacity-30 md:left-0"
        >
          <FaChevronLeft className="text-[1.25rem] sm:text-[1.4rem] md:text-[1.5rem] lg:text-[1.65rem]" />
        </button>

        {visibleItems.length === 0 ? (
          <div className="opacity-50 font-bold rounded-xl border border-secondary-normal/10 bg-white px-4 py-8 text-center text-sm text-gray-500 lg:py-24">
            No reviews available yet.
          </div>
        ) : (
          <div
            className={`grid gap-3 sm:gap-4 md:gap-5 ${
              itemsPerView <= 2
                ? "grid-cols-1 md:grid-cols-2"
                : itemsPerView === 3
                  ? "grid-cols-3"
                  : "grid-cols-4"
            }`}
          >
            {visibleItems.map((item) => {
              const isExpanded = !!expandedIds[item.id];
              const isLong = item.quote.length > COMMENT_PREVIEW_LENGTH;
              const preview = isExpanded
                ? item.quote
                : `${item.quote.slice(0, COMMENT_PREVIEW_LENGTH).trimEnd()}${
                    isLong ? "..." : ""
                  }`;
              const sourceMeta = item.source ? SOURCE_META[item.source] : null;

              return (
                <article
                  key={item.id}
                  className="rounded-xl bg-[#dedede] px-4 py-4 text-secondary-normal shadow-[0_4px_0_rgba(18,40,55,0.06)] md:px-5 md:py-5 xl:px-6"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3 md:h-[9rem]">
                      <FaQuoteLeft
                        className="mt-0.5 shrink-0 text-[#2db4d6]"
                        size={26}
                      />
                      <div className="min-w-0 flex-1 max-h-[11.5rem] overflow-y-auto pr-1">
                        <p className="text-sm leading-7 md:text-[0.95rem] lg:text-base 2xl:text-lg">
                          {preview}
                          {isLong && (
                            <button
                              type="button"
                              className="ml-1 inline px-1.5 py-[1px] text-[10px] font-bold tracking-wide text-primary-normal md:text-[11px]"
                              onClick={() => onToggleExpanded(item.id)}
                            >
                              <span className="text-xs font-bold">
                                {isExpanded ? "Read less" : "Read more"}
                              </span>
                            </button>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-secondary-normal/10 pt-2">
                      <div>
                        {item.isImported && (
                          <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-secondary-normal/65">
                            <span>From:</span>
                            {sourceMeta?.icon ?? (
                              <FaGlobe size={16} className="text-[#0B5173]" />
                            )}
                          </p>
                        )}
                        <div className="mt-2.5 flex items-center gap-0.5 text-[#dfc91c]">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <FaStar
                              key={`${item.id}-star-${index}`}
                              size={15}
                              className={
                                index < item.rating
                                  ? "opacity-100"
                                  : "opacity-30"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex min-w-0 items-center gap-2.5">
                        <p className="max-w-[10rem] truncate text-sm font-bold md:max-w-none md:text-[0.95rem] lg:text-base xl:text-lg 2xl:text-xl">
                          {item.name.trim().split(/\s+/)[0] || "Anonymous"}
                        </p>

                        <div className="relative size-9 overflow-hidden rounded-full border border-secondary-normal/15 bg-white xl:size-10 2xl:size-11">
                          {item.avatarUrl ? (
                            <Image
                              src={item.avatarUrl}
                              alt={`${item.name} profile`}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <FaRegCircleUser size={18} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <button
          type="button"
          aria-label="Next testimonials"
          onClick={onNext}
          disabled={isNextDisabled}
          className="absolute -right-1 top-[48%] z-10 -translate-y-1/2 text-secondary-normal transition enabled:hover:text-secondary-normal/70 disabled:cursor-not-allowed disabled:opacity-30 md:right-0"
        >
          <FaChevronRight className="text-[1.25rem] sm:text-[1.4rem] md:text-[1.5rem] lg:text-[1.65rem]" />
        </button>
      </div>
    </section>
  );
}
