import Image from "next/image";
import Link from "next/link";
import type { ReviewUnitPreview } from "./types";

export default function ReviewProductCard({
  unit,
}: {
  unit: ReviewUnitPreview | null;
}) {
  if (!unit) {
    return (
      <div className="mt-[1rem] md:mt-4 rounded-xl border border-secondary-normal/20 md:border-secondary-normal/15 p-3 md:p-4 bg-white md:shadow-sm">
        <p className="text-sm text-gray-500">Unit details are unavailable.</p>
      </div>
    );
  }

  return (
    <div className="mt-[1rem] md:mt-4 rounded-xl border border-secondary-normal/20 md:border-secondary-normal/15 p-3 md:p-4 bg-white md:shadow-sm">
      <Link
        href={`/units/${unit.id}`}
        className="flex items-center gap-3 md:gap-4 rounded-lg md:hover:bg-secondary-normal/5 md:p-2 md:-m-2 transition-colors"
      >
        <div className="relative w-[5rem] h-[5rem] md:w-[6.5rem] md:h-[6.5rem] rounded-lg overflow-hidden bg-gray-100 shrink-0">
          {unit.thumbnailUrl ? (
            <Image
              src={unit.thumbnailUrl}
              alt={unit.thumbnailAlt || unit.name}
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
          <p className="text-xs md:text-sm text-gray-500">Reviews for unit</p>
          <p className="font-bold truncate text-secondary-normal md:text-lg">
            {unit.name}
          </p>
          <p className="text-xs md:text-sm text-secondary-normal underline mt-1">
            View unit details
          </p>
        </div>
      </Link>
    </div>
  );
}
