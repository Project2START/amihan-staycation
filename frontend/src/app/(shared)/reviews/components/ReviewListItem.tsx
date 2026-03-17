import dayjs from "dayjs";
import { FaEye, FaEyeSlash, FaStar } from "react-icons/fa6";
import type { ReviewItemData } from "./types";

export default function ReviewListItem({
  review,
  isAdmin,
  onToggleVisibility,
  updating,
}: {
  review: ReviewItemData;
  isAdmin: boolean;
  onToggleVisibility?: (reviewId: string, nextHidden: boolean) => void;
  updating?: boolean;
}) {
  return (
    <article
      className={`rounded-lg border p-3 bg-white ${review.isHidden ? "border-reject-normal/40 opacity-80" : "border-secondary-normal/20"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-secondary-normal">
            {review.reviewerName}
          </p>
          <p className="text-[11px] text-gray-500">
            {dayjs(review.createdAt).format("MMMM D, YYYY")}
          </p>
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
        {review.comment?.trim() ? review.comment : "No comment provided."}
      </p>

      {review.isImported && (
        <p className="mt-2 text-[11px] text-gray-500 uppercase tracking-wide">
          Imported {review.source ? `from ${review.source}` : "review"}
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
