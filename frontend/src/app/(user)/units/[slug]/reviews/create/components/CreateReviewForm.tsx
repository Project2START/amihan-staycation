"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
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
        const result = await axios.get<{ eligibility: EligibilityData }>(
          `${HOST}/api/reviews/in-app-eligibility/${productId}`,
          { withCredentials: true },
        );

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
      await axios.post(
        `${HOST}/api/reviews/in-app`,
        {
          productId,
          rating,
          comment,
        },
        { withCredentials: true },
      );

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
      <div className="px-[1rem] py-[1.5rem] grid gap-y-3">
        <Skeleton variant="rounded" height={52} />
        <Skeleton variant="rounded" height={120} />
        <Skeleton variant="rounded" height={230} />
      </div>
    );
  }

  return (
    <div className="px-[1rem] py-[1.5rem] text-secondary-normal">
      <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 pb-[1rem]">
        <span className="flex-1/3 flex items-center">
          <PrimaryBackButton onClick={() => router.back()} style="text-xl" />
        </span>
        <h1 className="flex-1/3 text-nowrap text-center font-semibold">
          Write a Review
        </h1>
        <span className="flex-1/3" />
      </div>

      <div className="mt-[1.25rem] rounded-xl border border-secondary-normal/20 p-3 bg-white">
        {eligibility?.unit ? (
          <Link
            href={`/units/${eligibility.unit.id}`}
            className="flex items-center gap-3"
          >
            <div className="relative w-[5rem] h-[5rem] rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {eligibility.unit.thumbnailUrl ? (
                <Image
                  src={eligibility.unit.thumbnailUrl}
                  alt={eligibility.unit.thumbnailAlt || eligibility.unit.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 text-center p-2">
                  No image
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Reviewing unit</p>
              <p className="font-bold truncate">{eligibility.unit.name}</p>
              <p className="text-xs text-secondary-normal underline mt-1">
                View unit details
              </p>
            </div>
          </Link>
        ) : (
          <p className="text-sm text-gray-500">Unit details are unavailable.</p>
        )}
      </div>

      <div className="mt-[1rem] rounded-xl border border-secondary-normal/20 p-4 bg-white">
        <p className="text-sm font-semibold">Your rating</p>
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
                className="text-2xl cursor-pointer"
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

        <div className="mt-4">
          <label className="text-sm font-semibold" htmlFor="review-comment">
            Comment (optional)
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className="mt-2 w-full min-h-[8rem] rounded-lg border border-secondary-normal/20 px-3 py-2 text-sm resize-none"
            placeholder="Share your stay experience..."
            maxLength={MAX_COMMENT_LENGTH}
            disabled={!canSubmit || submitLoading}
          />
          <p className="text-[11px] text-gray-400 mt-1 text-right">
            {comment.length}/{MAX_COMMENT_LENGTH}
          </p>
        </div>

        {!canSubmit ? (
          <p className="mt-3 text-xs text-reject-normal font-semibold">
            {eligibility?.reason ||
              "You cannot submit a review right now. Reviews are only allowed within 14 days after checkout."}
          </p>
        ) : reviewWindowText ? (
          <p className="mt-3 text-xs text-gray-500">
            You can submit this review until {reviewWindowText}.
          </p>
        ) : null}

        <div className="mt-4">
          <LoadingOverlay loading={submitLoading}>
            <button
              type="button"
              onClick={submit}
              disabled={!canSubmit || rating < 1 || submitLoading}
              className="w-full py-2 rounded-lg bg-secondary-normal text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
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
