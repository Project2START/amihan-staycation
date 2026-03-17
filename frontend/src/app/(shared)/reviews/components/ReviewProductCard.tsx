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
      <div className="mt-[1rem] rounded-xl border border-secondary-normal/20 p-3 bg-white">
        <p className="text-sm text-gray-500">Unit details are unavailable.</p>
      </div>
    );
  }

  return (
    <div className="mt-[1rem] rounded-xl border border-secondary-normal/20 p-3 bg-white">
      <Link href={`/units/${unit.id}`} className="flex items-center gap-3">
        <div className="relative w-[5rem] h-[5rem] rounded-lg overflow-hidden bg-gray-100 shrink-0">
          {unit.thumbnailUrl ? (
            <Image
              src={unit.thumbnailUrl}
              alt={unit.thumbnailAlt || unit.name}
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
          <p className="text-xs text-gray-500">Reviews for unit</p>
          <p className="font-bold truncate text-secondary-normal">
            {unit.name}
          </p>
          <p className="text-xs text-secondary-normal underline mt-1">
            View unit details
          </p>
        </div>
      </Link>
    </div>
  );
}
