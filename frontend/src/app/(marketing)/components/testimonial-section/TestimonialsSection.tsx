"use client";

import { useEffect, useMemo, useState } from "react";
import { HOST } from "@/app/shared/constants/config";
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

type ProductPreview = {
  id: string;
};

type ProductListResponse = {
  products: ProductPreview[];
};

type ProductReviewsResponse = {
  unit: {
    id: string;
    name: string;
  } | null;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    isImported: boolean;
    source: string | null;
    createdAt: string;
    reviewerName: string;
    reviewerAvatarUrl: string | null;
  }>;
};

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

const MAX_TESTIMONIALS = 10;
const MIN_POSITIVE_RATING = 4;
const COMMENT_PREVIEW_LENGTH = 180;
const PRODUCT_FETCH_LIMIT = 20;

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

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    let mounted = true;

    const fetchTestimonials = async () => {
      try {
        setLoading(true);

        const productsResult = await fetch(`${HOST}/api/products`, {
          cache: "no-cache",
        });

        if (!productsResult.ok) {
          if (mounted) setTestimonials([]);
          return;
        }

        const productData: ProductListResponse = await productsResult.json();
        const productIds = (productData.products ?? [])
          .slice(0, PRODUCT_FETCH_LIMIT)
          .map((product) => product.id)
          .filter(Boolean);

        const reviewResults = await Promise.allSettled(
          productIds.map((productId) =>
            fetch(`${HOST}/api/reviews/product/${productId}`, {
              cache: "no-cache",
            }),
          ),
        );

        const normalized: TestimonialItem[] = [];

        for (const result of reviewResults) {
          if (result.status !== "fulfilled") continue;
          if (!result.value.ok) continue;

          const data: ProductReviewsResponse = await result.value.json();
          const unitName = data.unit?.name ?? "Amihan Staycation";

          for (const review of data.reviews ?? []) {
            if (review.rating < MIN_POSITIVE_RATING) continue;
            const reviewComment = review.comment?.trim();
            // Only include reviews with a non-empty comment
            if (!reviewComment) continue;

            normalized.push({
              id: review.id,
              quote: reviewComment,
              name: review.reviewerName || "Anonymous",
              avatarUrl: review.reviewerAvatarUrl,
              rating: review.rating,
              isImported: review.isImported,
              source: review.source,
              createdAt: review.createdAt,
              unitName,
            });
          }
        }

        const uniqueById = Array.from(
          new Map(normalized.map((item) => [item.id, item])).values(),
        )
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, MAX_TESTIMONIALS);

        if (mounted) {
          setTestimonials(uniqueById);
          setCurrentPage(0);
        }
      } catch {
        if (mounted) setTestimonials([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void fetchTestimonials();

    return () => {
      mounted = false;
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

        {loading && (
          <div>
            <div className="rounded-xl border border-secondary-normal/10 bg-white px-4 py-8 text-center text-sm text-gray-500">
              Loading testimonials...
            </div>
          </div>
        )}
        <div
          className={`grid gap-3 sm:gap-4 md:gap-5 ${
            itemsPerView <= 2
              ? "grid-cols-1 md:grid-cols-2"
              : itemsPerView === 3
                ? "grid-cols-3"
                : "grid-cols-4"
          }`}
        >
          {visibleItems.length === 0 && !loading ? (
            <div className="rounded-xl border border-secondary-normal/10 bg-white px-4 py-8 text-center text-sm text-gray-500">
              No reviews available yet.
            </div>
          ) : (
            visibleItems.map((item) => {
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
                    <div className="flex items-start gap-3">
                      <FaQuoteLeft
                        className="mt-0.5 shrink-0 text-[#2db4d6]"
                        size={26}
                      />
                      <div className="min-w-0 flex-1 max-h-[11.5rem] overflow-y-auto pr-1">
                        <p className="text-sm leading-7 md:text-[0.95rem] lg:text-base xl:text-lg 2xl:text-xl">
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
                        <div className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-secondary-normal/15 bg-white text-[11px] font-bold text-secondary-normal/80 xl:size-10 2xl:size-11">
                          {item.avatarUrl ? (
                            <img
                              src={item.avatarUrl}
                              alt={`${item.name} profile`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FaRegCircleUser size={18} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

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
