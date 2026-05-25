"use client";

import dayjs from "dayjs";
import Image from "next/image";
import {
  FaBookOpen,
  FaEye,
  FaEyeSlash,
  FaFacebook,
  FaGlobe,
  FaGoogle,
  FaMessage,
  FaRegCircleUser,
  FaStar,
} from "react-icons/fa6";
import type { ReviewItemData } from "./types";

const COMMENT_COLLAPSE_LENGTH = 180;

const SOURCE_META: Record<string, { label: string; icon: React.ReactNode }> = {
  GOOGLE: { label: "Google", icon: <FaGoogle size={11} /> },
  FACEBOOK: { label: "Facebook", icon: <FaFacebook size={11} /> },
  DIRECT_MESSAGE: { label: "Direct Message", icon: <FaMessage size={11} /> },
  GUESTBOOK: { label: "Guestbook", icon: <FaBookOpen size={11} /> },
  OTHER: { label: "Other", icon: <FaGlobe size={11} /> },
};

export default function ReviewListItem({
  review,
  isAdmin,
  onToggleVisibility,
  expanded,
  onToggleExpanded,
  updating,
}: {
  review: ReviewItemData;
  isAdmin: boolean;
  onToggleVisibility?: (reviewId: string, nextHidden: boolean) => void;
  expanded?: boolean;
  onToggleExpanded?: (reviewId: string) => void;
  updating?: boolean;
}) {
  const commentText = review.comment?.trim() || "No comment provided.";
  const isLongComment = commentText.length > COMMENT_COLLAPSE_LENGTH;
  const displayedComment =
    !expanded && isLongComment
      ? `${commentText.slice(0, COMMENT_COLLAPSE_LENGTH).trimEnd()}...`
      : commentText;
  const sourceMeta = review.source ? SOURCE_META[review.source] : null;

  return (
    <article
      className={`rounded-lg md:rounded-xl border p-3 md:p-4 bg-white transition-colors ${review.isHidden ? "border-reject-normal/40 opacity-80" : "border-secondary-normal/20 md:hover:border-secondary-normal/35 md:hover:bg-secondary-normal/[0.02]"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0 md:gap-3">
          <div className="relative size-9 md:size-10 shrink-0 rounded-full overflow-hidden bg-gray-100 border border-secondary-normal/10">
            {review.reviewerAvatarUrl ? (
              <Image
                src={review.reviewerAvatarUrl}
                alt={`${review.reviewerName} profile`}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40px, 36px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FaRegCircleUser size={20} />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm md:text-base font-bold text-secondary-normal truncate">
              {review.reviewerName}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
              <p className="text-[11px] md:text-xs text-gray-500">
                {dayjs(review.createdAt).format("MMMM D, YYYY")}
              </p>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const active = index < review.rating;
                  return (
                    <FaStar
                      key={`${review.id}-star-${index}`}
                      className={active ? "text-yellow-400" : "text-gray-300"}
                      size={12}
                    />
                  );
                })}
                <span className="ml-1 text-xs text-gray-500">
                  {review.rating}/5
                </span>
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => onToggleVisibility?.(review.id, !review.isHidden)}
            className="p-2 rounded-md border border-secondary-normal/20 text-secondary-normal hover:bg-secondary-normal/5 md:hover:bg-secondary-normal/10 disabled:opacity-60"
            aria-label={review.isHidden ? "Unhide review" : "Hide review"}
            title={review.isHidden ? "Unhide review" : "Hide review"}
            disabled={updating}
          >
            {review.isHidden ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
          </button>
        )}
      </div>

      <p className="mt-2.5 md:mt-3 text-sm md:text-[15px] text-secondary-normal whitespace-pre-wrap break-words leading-relaxed md:pl-[3.1rem]">
        {displayedComment}
      </p>

      {isLongComment && (
        <button
          type="button"
          className="mt-1 text-primary-normal font-semibold underline underline-offset-2 md:ml-[3.1rem]"
          onClick={() => onToggleExpanded?.(review.id)}
        >
          <span className="text-xs">{expanded ? "See less" : "See more"}</span>
        </button>
      )}

      {review.isImported && (
        <p className="mt-2 text-[11px] text-gray-500 uppercase tracking-wide flex items-center gap-1 md:ml-[3.1rem]">
          {sourceMeta?.icon ?? <FaGlobe size={11} />}
          <span>
            Imported from {sourceMeta?.label ?? review.source ?? "other"}
          </span>
        </p>
      )}

      {review.isHidden && (
        <p className="mt-2 text-[11px] text-reject-normal font-semibold md:ml-[3.1rem]">
          This review is currently hidden.
        </p>
      )}
    </article>
  );
}
