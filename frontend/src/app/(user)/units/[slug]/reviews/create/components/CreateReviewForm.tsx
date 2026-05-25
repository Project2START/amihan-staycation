"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import axiosWithAuth from "@/app/shared/lib/axiosWithAuth";
import { HOST } from "@/app/shared/constants/config";
import { useEffect } from "react";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LoadingOverlay from "@/app/shared/ui/LoadingOverlay";
import { Skeleton } from "@mui/material";

type EligibilityData = {
  canSubmit: boolean;
  reason: string;
  bookingId: string | null;
  reviewWindowEndsAt: string | null;
  unit: {
    id: string;
    name: string;
    thumbnailUrl: string | null;
    thumbnailAlt: string;
  } | null;
};

const MAX_COMMENT_LENGTH = 1000;

export default function CreateReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [eligibilityLoading, setEligibilityLoading] = useState(true);
  const [eligibility, setEligibility] = useState<EligibilityData | null>(null);

  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setEligibilityLoading(true);
        const result = await axiosWithAuth.get<{
          eligibility: EligibilityData;
        }>(`${HOST}/api/reviews/in-app-eligibility/${productId}`);

        setEligibility(result.data.eligibility);
      } catch (error) {
        CustomToast.show(errorHandler(error).message, { indicator: "error" });
      } finally {
        setEligibilityLoading(false);
      }
    };

    void run();
  }, [productId]);

  const canSubmit = !!eligibility?.canSubmit;

  const reviewWindowText = useMemo(() => {
    if (!eligibility?.reviewWindowEndsAt) return null;
    const date = dayjs(eligibility.reviewWindowEndsAt);
    if (!date.isValid()) return null;
    return date.format("MMMM D, YYYY");
  }, [eligibility?.reviewWindowEndsAt]);

  const submit = async () => {
    if (!canSubmit || rating < 1 || submitLoading) return;

    try {
      setSubmitLoading(true);
      await axiosWithAuth.post(`${HOST}/api/reviews/in-app`, {
        productId,
        rating,
        comment,
      });

      CustomToast.show("Review submitted successfully", {
        indicator: "success",
      });

      setTimeout(() => {
        router.back();
      }, 700);
    } catch (error) {
      CustomToast.show(errorHandler(error).message, { indicator: "error" });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (eligibilityLoading) {
    return (
      <div className="px-[1rem] md:px-6 lg:px-8 py-[1.5rem] md:py-6 grid gap-y-3 md:gap-y-4 md:max-w-6xl md:mx-auto md:w-full">
        <Skeleton variant="rounded" height={52} className="md:!h-[66px]" />
        <Skeleton variant="rounded" height={120} className="md:!h-[136px]" />
        <div className="md:rounded-2xl md:border md:border-secondary-normal/15 md:bg-white md:p-5 lg:p-6 md:shadow-sm">
          <div className="md:grid md:grid-cols-[minmax(0,0.95fr),minmax(0,1.35fr)] md:gap-6 lg:gap-8">
            <Skeleton
              variant="rounded"
              height={250}
              className="md:!h-[330px]"
            />
            <Skeleton
              variant="rounded"
              height={250}
              className="hidden md:block md:!h-[330px]"
            />
          </div>
          <Skeleton variant="rounded" height={42} className="mt-4 md:mt-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-[1rem] md:px-6 lg:px-8 py-[1.5rem] md:py-6 text-secondary-normal md:max-w-6xl md:mx-auto md:w-full">
      <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 pb-[1rem]">
        <span className="flex-1/3 flex items-center">
          <PrimaryBackButton onClick={() => router.back()} style="text-xl" />
        </span>
        <h1 className="flex-1/3 text-nowrap text-center font-semibold lg:text-2xl">
          Write a Review
        </h1>
        <span className="flex-1/3" />
      </div>

      <div className="mt-[1.25rem] md:mt-4 rounded-xl md:rounded-2xl border border-secondary-normal/20 md:border-secondary-normal/15 p-3 md:p-4 lg:p-5 bg-white md:shadow-sm">
        {eligibility?.unit ? (
          <Link
            href={`/units/${eligibility.unit.id}`}
            className="flex items-center gap-3 md:gap-4 rounded-lg md:hover:bg-secondary-normal/5 md:p-2 md:-m-2 transition-colors"
          >
            <div className="relative w-[5rem] h-[5rem] md:w-[6.5rem] md:h-[6.5rem] rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {eligibility.unit.thumbnailUrl ? (
                <Image
                  src={eligibility.unit.thumbnailUrl}
                  alt={eligibility.unit.thumbnailAlt || eligibility.unit.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 104px, 80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 text-center p-2">
                  No image
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-500">Reviewing unit</p>
              <p className="font-bold truncate md:text-lg">
                {eligibility.unit.name}
              </p>
              <p className="text-xs md:text-sm text-secondary-normal underline mt-1">
                View unit details
              </p>
            </div>
          </Link>
        ) : (
          <p className="text-sm text-gray-500">Unit details are unavailable.</p>
        )}
      </div>

      <div className="mt-[1rem] md:mt-4 rounded-xl md:rounded-2xl border border-secondary-normal/20 md:border-secondary-normal/15 p-4 md:p-5 lg:p-6 bg-white md:shadow-sm">
        <div className="md:grid md:grid-cols-[minmax(0,0.95fr),minmax(0,1.35fr)] md:gap-6 lg:gap-8 md:items-start">
          <div className="md:rounded-xl md:border md:border-secondary-normal/10 md:bg-gradient-to-b md:from-amber-50/45 md:to-white md:p-5 lg:p-6">
            <div className="hidden md:block mb-3">
              <p className="text-sm lg:text-base font-semibold text-secondary-normal">
                Rating & Eligibility
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Rate your stay and verify if submission is available.
              </p>
            </div>

            <p className="text-sm md:text-base font-semibold">Your rating</p>
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1;
                const active = (hoveredStar ?? rating) >= value;

                return (
                  <button
                    key={value}
                    type="button"
                    onMouseEnter={() => setHoveredStar(value)}
                    onMouseLeave={() => setHoveredStar(null)}
                    onClick={() => setRating(value)}
                    className="text-2xl cursor-pointer transition-transform md:hover:scale-110"
                    aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                    disabled={!canSubmit || submitLoading}
                  >
                    <FaStar
                      className={active ? "text-yellow-400" : "text-gray-300"}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-xs text-gray-500">
                {rating > 0 ? `${rating}/5` : "Tap to rate"}
              </span>
            </div>

            <div className="mt-3 md:mt-4 rounded-lg md:border md:border-secondary-normal/10 md:bg-white/80 p-0 md:p-3">
              {!canSubmit ? (
                <p className="text-xs text-reject-normal font-semibold">
                  {eligibility?.reason ||
                    "You cannot submit a review right now. Reviews are only allowed within 14 days after checkout."}
                </p>
              ) : reviewWindowText ? (
                <p className="text-xs text-gray-500">
                  You can submit this review until {reviewWindowText}.
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  You are eligible to submit a review now.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 md:mt-0 md:rounded-xl md:border md:border-secondary-normal/10 md:bg-white md:p-5 lg:p-6">
            <p className="hidden md:block text-sm lg:text-base font-semibold mb-1">
              Your feedback
            </p>
            <p className="hidden md:block text-xs text-gray-500 mb-3">
              Describe your experience with details that can help future guests.
            </p>
            <label className="text-sm font-semibold" htmlFor="review-comment">
              Comment (optional)
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="mt-2 w-full min-h-[8rem] md:min-h-[13rem] lg:min-h-[14rem] rounded-lg border border-secondary-normal/20 px-3 py-2.5 text-sm resize-none"
              placeholder="Share your stay experience..."
              maxLength={MAX_COMMENT_LENGTH}
              disabled={!canSubmit || submitLoading}
            />
            <p className="text-[11px] text-gray-400 mt-1 text-right">
              {comment.length}/{MAX_COMMENT_LENGTH}
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-5 lg:mt-6 md:border-t md:border-secondary-normal/10 md:pt-4 md:flex md:justify-end">
          <LoadingOverlay loading={submitLoading}>
            <button
              type="button"
              onClick={submit}
              disabled={!canSubmit || rating < 1 || submitLoading}
              className="w-full md:w-auto md:min-w-[19rem] py-2.5 rounded-lg bg-secondary-normal text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="text-sm">
                {!canSubmit
                  ? "Review Not Available"
                  : rating < 1
                    ? "Select a Rating to Submit"
                    : submitLoading
                      ? "Submitting..."
                      : "Submit Review"}
              </span>
            </button>
          </LoadingOverlay>
        </div>
      </div>
    </div>
  );
}
