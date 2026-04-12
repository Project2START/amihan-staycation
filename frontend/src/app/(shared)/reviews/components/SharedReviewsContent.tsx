"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@mui/material";
import { FaStar } from "react-icons/fa6";
import { HOST } from "@/app/shared/constants/config";
import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import { useAppSelector } from "@/lib/hooks";
import ReviewProductCard from "./ReviewProductCard";
import ReviewListItem from "./ReviewListItem";
import type {
  EligibilityData,
  ProductReviewsResponse,
  ReviewItemData,
} from "./types";
import NotFoundClient from "@/app/shared/components/NotFoundClient";

type ReviewsApiResult = ProductReviewsResponse & { message: string };

export default function SharedReviewsContent({
  productId,
}: {
  productId: string | undefined;
}) {
  const router = useRouter();
  const user = useAppSelector((state) => state.users.data);

  const [loading, setLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState<ProductReviewsResponse>({
    unit: null,
    reviews: [],
  });
  const [eligibility, setEligibility] = useState<EligibilityData | null>(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
  const [updatingReviewId, setUpdatingReviewId] = useState<string | null>(null);
  const [expandedReviewIds, setExpandedReviewIds] = useState<string[]>([]);

  const isAdmin = user?.role === "admin";
  const isGuest = !user;

  useEffect(() => {
    const run = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await axios.get<ReviewsApiResult>(
          `${HOST}/api/reviews/product/${productId}`,
          { withCredentials: true },
        );

        setReviewsData({
          unit: result.data.unit,
          reviews: result.data.reviews,
        });
      } catch (error) {
        CustomToast.show(errorHandler(error).message, { indicator: "error" });
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [productId]);

  useEffect(() => {
    const run = async () => {
      if (!productId || isAdmin || isGuest) return;

      try {
        setEligibilityLoading(true);
        const result = await axios.get<{ eligibility: EligibilityData }>(
          `${HOST}/api/reviews/in-app-eligibility/${productId}`,
          { withCredentials: true },
        );
        setEligibility(result.data.eligibility);
      } catch (error) {
        setEligibility(null);
      } finally {
        setEligibilityLoading(false);
      }
    };

    void run();
  }, [isAdmin, isGuest, productId]);

  const onToggleVisibility = async (reviewId: string, nextHidden: boolean) => {
    if (!isAdmin) return;

    try {
      setUpdatingReviewId(reviewId);
      await axios.patch(
        `${HOST}/api/reviews/${reviewId}/visibility`,
        { isHidden: nextHidden },
        { withCredentials: true },
      );

      setReviewsData((prev) => ({
        ...prev,
        reviews: prev.reviews.map((review) =>
          review.id === reviewId ? { ...review, isHidden: nextHidden } : review,
        ),
      }));
    } catch (error) {
      CustomToast.show(errorHandler(error).message, { indicator: "error" });
    } finally {
      setUpdatingReviewId(null);
    }
  };

  const sortedReviews = useMemo(() => {
    return [...reviewsData.reviews].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [reviewsData.reviews]);

  const averageRating = useMemo(() => {
    if (!sortedReviews.length) return 0;

    const total = sortedReviews.reduce((sum, review) => sum + review.rating, 0);
    return total / sortedReviews.length;
  }, [sortedReviews]);

  const roundedAverageRating = Math.round(averageRating);

  const showSubmitButton =
    isAdmin || (!!eligibility?.canSubmit && !eligibilityLoading);
  const submitHref = isAdmin
    ? productId
      ? `/spaces/${productId}/reviews/create`
      : ""
    : productId
      ? `/units/${productId}/reviews/create`
      : "";

  const onToggleExpanded = (reviewId: string) => {
    setExpandedReviewIds((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId],
    );
  };

  if (loading) {
    return (
      <div className="lg:flex lg:justify-center">
        <div className="px-[1rem] md:px-6 lg:px-8 py-[1.5rem] md:py-6 grid gap-y-3 md:gap-y-4 lg:w-[60%]">
          <Skeleton variant="rounded" height={52} className="md:!h-[64px]" />
          <Skeleton variant="rounded" height={120} className="md:!h-[140px]" />
          <div className="md:rounded-xl md:border md:border-secondary-normal/15 md:bg-white md:p-4 lg:p-5 md:shadow-sm">
            <div className="hidden md:grid md:grid-cols-[1fr,auto] gap-3 mb-4">
              <Skeleton variant="rounded" height={30} />
              <Skeleton variant="rounded" width={180} height={30} />
            </div>
            <Skeleton
              variant="rounded"
              height={360}
              className="md:!h-[440px]"
            />
          </div>
        </div>
      </div>
    );
  }

  if (!productId) {
    return <NotFoundClient />;
  }

  return (
    <div className="lg:flex lg:justify-center">
      <div className="px-[1rem] md:px-6 lg:px-8 py-[1.5rem] md:py-6 text-secondary-normal h-[100vh] flex flex-col overflow-hidden lg:w-[60%]">
        <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 pb-[1rem]">
          <span className="flex-1/3 flex items-center">
            <PrimaryBackButton onClick={() => router.back()} style="text-xl" />
          </span>
          <h1 className="flex-1/3 text-nowrap text-center font-semibold lg:text-2xl">
            Unit Reviews
          </h1>
          <span className="flex-1/3" />
        </div>

        {productId && (
          <div className="flex-1 min-h-0 flex flex-col">
            <ReviewProductCard unit={reviewsData.unit} />

            <div className="mt-[1rem] md:mt-4 flex-1 min-h-0 rounded-xl border border-secondary-normal/20 md:border-secondary-normal/15 bg-[#fafafa] md:bg-white p-3 md:p-4 lg:p-5 flex flex-col overflow-hidden shadow-none md:shadow-sm">
              <div className="mb-3 md:mb-4 md:grid md:grid-cols-[1fr,auto] md:items-center md:gap-4">
                <div>
                  <p className="hidden md:block text-sm font-semibold text-secondary-normal lg:text-lg">
                    Guest Reviews
                  </p>
                  <div className="text-xs md:text-sm text-gray-500">
                    {sortedReviews.length} review
                    {sortedReviews.length === 1 ? "" : "s"}
                  </div>
                </div>

                <div className="flex items-center gap-1 md:gap-2 text-[11px] md:text-xs text-gray-600 rounded-lg md:border md:border-secondary-normal/15 md:px-3 md:py-1.5">
                  <span className="font-medium">Overall</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FaStar
                        key={`overall-star-${index}`}
                        className={
                          index < roundedAverageRating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                        size={12}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-secondary-normal">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto grid gap-y-2 md:gap-y-3 pr-1 md:pr-2">
                {sortedReviews.length === 0 ? (
                  <div className="rounded-lg border border-secondary-normal/20 bg-white p-3 md:p-4 text-sm text-gray-500">
                    No reviews yet for this unit.
                  </div>
                ) : (
                  sortedReviews.map((review: ReviewItemData) => (
                    <ReviewListItem
                      key={review.id}
                      review={review}
                      isAdmin={isAdmin}
                      onToggleVisibility={onToggleVisibility}
                      expanded={expandedReviewIds.includes(review.id)}
                      onToggleExpanded={onToggleExpanded}
                      updating={updatingReviewId === review.id}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        {showSubmitButton && (
          <div className="mt-3 shrink-0">
            <Link href={submitHref}>
              <button
                type="button"
                className="w-full py-2 rounded-lg bg-primary-normal text-white font-bold disabled:opacity-60"
              >
                <span className="text-sm font-bold">Submit Review</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
