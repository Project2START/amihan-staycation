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
      className={`rounded-lg border p-3 bg-white ${review.isHidden ? "border-reject-normal/40 opacity-80" : "border-secondary-normal/20"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <div className="relative size-9 shrink-0 rounded-full overflow-hidden bg-gray-100 border border-secondary-normal/10">
            {review.reviewerAvatarUrl ? (
              <Image
                src={review.reviewerAvatarUrl}
                alt={`${review.reviewerName} profile`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FaRegCircleUser size={20} />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-secondary-normal truncate">
              {review.reviewerName}
            </p>
            <p className="text-[11px] text-gray-500">
              {dayjs(review.createdAt).format("MMMM D, YYYY")}
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => onToggleVisibility?.(review.id, !review.isHidden)}
            className="p-2 rounded-md border border-secondary-normal/20 text-secondary-normal hover:bg-secondary-normal/5 disabled:opacity-60"
            aria-label={review.isHidden ? "Unhide review" : "Hide review"}
            title={review.isHidden ? "Unhide review" : "Hide review"}
            disabled={updating}
          >
            {review.isHidden ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const active = index < review.rating;
          return (
            <FaStar
              key={`${review.id}-star-${index}`}
              className={active ? "text-yellow-400" : "text-gray-300"}
              size={14}
            />
          );
        })}
        <span className="ml-1 text-xs text-gray-500">{review.rating}/5</span>
      </div>

      <p className="mt-2 text-sm text-secondary-normal whitespace-pre-wrap break-words">
        {displayedComment}
      </p>

      {isLongComment && (
        <button
          type="button"
          className="mt-1 text-primary-normal font-semibold underline underline-offset-2"
          onClick={() => onToggleExpanded?.(review.id)}
        >
          <span className="text-xs">{expanded ? "See less" : "See more"}</span>
        </button>
      )}

      {review.isImported && (
        <p className="mt-2 text-[11px] text-gray-500 uppercase tracking-wide flex items-center gap-1">
          {sourceMeta?.icon ?? <FaGlobe size={11} />}
          <span>
            Imported from {sourceMeta?.label ?? review.source ?? "other"}
          </span>
        </p>
      )}

      {review.isHidden && (
        <p className="mt-2 text-[11px] text-reject-normal font-semibold">
          This review is currently hidden.
        </p>
      )}
    </article>
  );
}
