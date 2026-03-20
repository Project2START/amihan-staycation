"use client";

import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Skeleton } from "@mui/material";
import {
  FaBookOpen,
  FaFacebook,
  FaGlobe,
  FaGoogle,
  FaMessage,
  FaStar,
} from "react-icons/fa6";
import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import LoadingOverlay from "@/app/shared/ui/LoadingOverlay";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import { HOST } from "@/app/shared/constants/config";

type UnitPreview = {
  id: string;
  name: string;
  photos?: Array<{
    id: string;
    image_url: string;
    alt: string;
  }>;
};

type SourceOption = {
  value: "GOOGLE" | "FACEBOOK" | "DIRECT_MESSAGE" | "GUESTBOOK" | "OTHER";
  label: string;
  icon: React.ReactNode;
};

const MAX_COMMENT_LENGTH = 1000;

const SOURCE_OPTIONS: SourceOption[] = [
  { value: "GOOGLE", label: "Google", icon: <FaGoogle size={18} /> },
  { value: "FACEBOOK", label: "Facebook", icon: <FaFacebook size={18} /> },
  {
    value: "DIRECT_MESSAGE",
    label: "Direct Message",
    icon: <FaMessage size={18} />,
  },
  { value: "GUESTBOOK", label: "Guestbook", icon: <FaBookOpen size={18} /> },
  { value: "OTHER", label: "Other (e.g. TikTok)", icon: <FaGlobe size={18} /> },
];

export default function CreateImportedReviewForm({
  productId,
}: {
  productId: string;
}) {
  const router = useRouter();

  const [loadingUnit, setLoadingUnit] = useState(true);
  const [unit, setUnit] = useState<UnitPreview | null>(null);

  const [reviewerName, setReviewerName] = useState("");
  const [source, setSource] = useState<SourceOption["value"] | null>(null);
  const [originalDate, setOriginalDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoadingUnit(true);
        const result = await axios.get<{ product: UnitPreview }>(
          `${HOST}/api/products/${productId}`,
          { withCredentials: true },
        );
        setUnit(result.data.product);
      } catch (error) {
        CustomToast.show(errorHandler(error).message, { indicator: "error" });
      } finally {
        setLoadingUnit(false);
      }
    };

    void run();
  }, [productId]);

  const selectedSourceLabel = useMemo(() => {
    return SOURCE_OPTIONS.find((item) => item.value === source)?.label ?? "";
  }, [source]);

  const submit = async () => {
    if (submitLoading) return;

    if (!reviewerName.trim()) {
      CustomToast.show("Reviewer name is required.", { indicator: "error" });
      return;
    }

    if (!source) {
      CustomToast.show("Please select a review source.", {
        indicator: "error",
      });
      return;
    }

    if (!originalDate) {
      CustomToast.show("Original review date is required.", {
        indicator: "error",
      });
      return;
    }

    if (rating < 1) {
      CustomToast.show("Please select a rating.", { indicator: "error" });
      return;
    }

    try {
      setSubmitLoading(true);

      await axios.post(
        `${HOST}/api/reviews/imported`,
        {
          productId,
          reviewerName: reviewerName.trim(),
          source,
          originalDate: new Date(originalDate).toISOString(),
          rating,
          comment,
        },
        { withCredentials: true },
      );

      CustomToast.show("Imported review submitted successfully", {
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

  if (loadingUnit) {
    return (
      <div className="px-[1rem] md:px-6 lg:px-8 py-[1.5rem] md:py-6 grid gap-y-3 md:gap-y-4">
        <Skeleton variant="rounded" height={52} className="md:!h-[64px]" />
        <Skeleton variant="rounded" height={120} className="md:!h-[132px]" />
        <div className="md:rounded-xl md:border md:border-secondary-normal/15 md:bg-white md:p-5 lg:p-6">
          <Skeleton variant="rounded" height={290} className="md:!h-[360px]" />
        </div>
      </div>
    );
  }

  const thumb = unit?.photos?.[0];

  return (
    <div className="px-[1rem] md:px-6 lg:px-8 py-[1.5rem] md:py-6 text-secondary-normal">
      <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 pb-[1rem]">
        <span className="flex-1/3 flex items-center">
          <PrimaryBackButton onClick={() => router.back()} style="text-xl" />
        </span>
        <h1 className="flex-1/3 text-nowrap text-center font-semibold">
          Import Review
        </h1>
        <span className="flex-1/3" />
      </div>

      <div className="mt-[1.25rem] md:mt-4 rounded-xl border border-secondary-normal/20 md:border-secondary-normal/15 p-3 md:p-4 bg-white md:shadow-sm">
        {unit ? (
          <Link
            href={`/spaces/${unit.id}`}
            className="flex items-center gap-3 md:gap-4 rounded-lg md:hover:bg-secondary-normal/5 md:p-2 md:-m-2 transition-colors"
          >
            <div className="relative w-[5rem] h-[5rem] md:w-[6.5rem] md:h-[6.5rem] rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {thumb?.image_url ? (
                <Image
                  src={thumb.image_url}
                  alt={thumb.alt || unit.name}
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
              <p className="text-xs md:text-sm text-gray-500">
                Importing review for unit
              </p>
              <p className="font-bold truncate md:text-lg">{unit.name}</p>
              <p className="text-xs md:text-sm text-secondary-normal underline mt-1">
                View unit details
              </p>
            </div>
          </Link>
        ) : (
          <p className="text-sm text-gray-500">Unit details are unavailable.</p>
        )}
      </div>

      <div className="mt-[1rem] md:mt-4 rounded-xl border border-secondary-normal/20 md:border-secondary-normal/15 p-4 md:p-5 lg:p-6 bg-white md:shadow-sm grid gap-y-4 md:gap-y-5">
        <div className="hidden md:flex items-center justify-between rounded-lg border border-secondary-normal/10 bg-secondary-normal/[0.03] px-4 py-2.5">
          <p className="text-sm font-semibold">Imported Review Metadata</p>
          <p className="text-xs text-gray-500">Admin Only</p>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-6 lg:gap-7">
          <div>
            <label htmlFor="reviewer-name" className="text-sm font-semibold">
              Reviewer name
            </label>
            <input
              id="reviewer-name"
              type="text"
              value={reviewerName}
              onChange={(event) => setReviewerName(event.target.value)}
              placeholder="Name from external review"
              className="mt-2 w-full rounded-lg border border-secondary-normal/20 px-3 py-2 text-sm"
              disabled={submitLoading}
            />
          </div>

          <div className="mt-4 md:mt-0 md:rounded-lg md:border md:border-secondary-normal/10 md:bg-secondary-normal/[0.02] md:p-4">
            <p className="text-sm font-semibold">Source</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {SOURCE_OPTIONS.map((item) => {
                const isActive = item.value === source;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSource(item.value)}
                    className={`rounded-lg border px-3 py-2 flex items-center gap-2 text-sm transition ${
                      isActive
                        ? "border-primary-normal bg-primary-normal/10 text-primary-normal"
                        : "border-secondary-normal/20 text-secondary-normal hover:bg-secondary-normal/5 md:hover:bg-secondary-normal/10"
                    }`}
                    disabled={submitLoading}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
            {selectedSourceLabel ? (
              <p className="mt-1 text-[11px] text-gray-500">
                Selected: {selectedSourceLabel}
              </p>
            ) : null}
          </div>
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-6 lg:gap-7">
          <div>
            <label htmlFor="original-date" className="text-sm font-semibold">
              Original date
            </label>
            <input
              id="original-date"
              type="date"
              value={originalDate}
              onChange={(event) => setOriginalDate(event.target.value)}
              max={dayjs().format("YYYY-MM-DD")}
              className="mt-2 w-full rounded-lg border border-secondary-normal/20 px-3 py-2 text-sm"
              disabled={submitLoading}
            />
          </div>

          <div className="mt-4 md:mt-0 md:rounded-lg md:border md:border-secondary-normal/10 md:bg-secondary-normal/[0.02] md:p-4">
            <p className="text-sm font-semibold">Rating</p>
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
                    disabled={submitLoading}
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
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold" htmlFor="review-comment">
            Comment (optional)
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            className="mt-2 w-full min-h-[8rem] rounded-lg border border-secondary-normal/20 px-3 py-2 text-sm resize-none"
            placeholder="Paste or write the imported feedback..."
            maxLength={MAX_COMMENT_LENGTH}
            disabled={submitLoading}
          />
          <p className="text-[11px] text-gray-400 mt-1 text-right">
            {comment.length}/{MAX_COMMENT_LENGTH}
          </p>
        </div>

        <div className="md:border-t md:border-secondary-normal/10 md:pt-4">
          <LoadingOverlay loading={submitLoading}>
            <button
              type="button"
              onClick={submit}
              disabled={submitLoading}
              className="w-full py-2 rounded-lg bg-secondary-normal text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="text-sm">
                {submitLoading ? "Submitting..." : "Submit Imported Review"}
              </span>
            </button>
          </LoadingOverlay>
        </div>
      </div>
    </div>
  );
}
