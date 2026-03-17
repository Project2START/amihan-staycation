"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@mui/material";
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
  productId: string | null;
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

  const showSubmitButton =
    isAdmin || (!!eligibility?.canSubmit && !eligibilityLoading);
  const submitHref = isAdmin
    ? productId
      ? `/spaces/${productId}/reviews/create`
      : ""
    : productId
      ? `/units/${productId}/reviews/create`
      : "";

  if (loading) {
    return (
      <div className="px-[1rem] py-[1.5rem] grid gap-y-3">
        <Skeleton variant="rounded" height={52} />
        <Skeleton variant="rounded" height={120} />
        <Skeleton variant="rounded" height={360} />
      </div>
    );
  }

  if (!productId) {
    return <NotFoundClient />;
  }

  return (
    <div className="px-[1rem] py-[1.5rem] text-secondary-normal h-[calc(100dvh-5.5rem)] flex flex-col">
      <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 pb-[1rem]">
        <span className="flex-1/3 flex items-center">
          <PrimaryBackButton onClick={() => router.back()} style="text-xl" />
        </span>
        <h1 className="flex-1/3 text-nowrap text-center font-semibold">
          Unit Reviews
        </h1>
        <span className="flex-1/3" />
      </div>

      {productId && (
        //   (
        //     <div className="mt-[1rem] rounded-lg border border-reject-normal/40 bg-white p-3 text-sm text-reject-normal font-semibold">
        //       Missing product id. Use query like ?productId=&lt;unit-id&gt;.
        //     </div>
        //   )
        //   : (
        <>
          <ReviewProductCard unit={reviewsData.unit} />

          <div className="mt-[1rem] flex-1 min-h-0 rounded-xl border border-secondary-normal/20 bg-[#fafafa] p-3 flex flex-col">
            <div className="mb-2 text-xs text-gray-500">
              {sortedReviews.length} review
              {sortedReviews.length === 1 ? "" : "s"}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto grid gap-y-2 pr-1">
              {sortedReviews.length === 0 ? (
                <div className="rounded-lg border border-secondary-normal/20 bg-white p-3 text-sm text-gray-500">
                  No reviews yet for this unit.
                </div>
              ) : (
                sortedReviews.map((review: ReviewItemData) => (
                  <ReviewListItem
                    key={review.id}
                    review={review}
                    isAdmin={isAdmin}
                    onToggleVisibility={onToggleVisibility}
                    updating={updatingReviewId === review.id}
                  />
                ))
              )}
            </div>
          </div>

          {showSubmitButton && (
            <div className="mt-3">
              <Link href={submitHref}>
                <button
                  type="button"
                  className="w-full py-2 rounded-lg bg-primary-normal text-white font-bold disabled:opacity-60"
                >
                  Submit Review
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
