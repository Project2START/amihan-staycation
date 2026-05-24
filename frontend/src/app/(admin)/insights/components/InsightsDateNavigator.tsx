import { ReactNode } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface InsightsDateNavigatorProps {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
  rightActions?: ReactNode;
  hideNavigation?: boolean;
}

export default function InsightsDateNavigator({
  label,
  onPrevious,
  onNext,
  rightActions,
  hideNavigation = false,
}: InsightsDateNavigatorProps) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-secondary-normal/20 min-h-[2.75rem] py-[1rem] lg:border-none">
      <div />

      <div className="min-w-0 flex items-center gap-x-1 sm:gap-x-2">
        {!hideNavigation && (
          <button
            type="button"
            onClick={onPrevious}
            className="p-1 rounded hover:bg-secondary-normal/10"
            aria-label="Previous period"
          >
            <LuChevronLeft className="text-[1.35rem] text-gray-500" />
          </button>
        )}
        <h2 className="max-w-[11rem] truncate font-bold text-gray-600 text-center text-sm sm:max-w-[17rem] sm:text-base">
          {label}
        </h2>
        {!hideNavigation && (
          <button
            type="button"
            onClick={onNext}
            className="p-1 rounded hover:bg-secondary-normal/10"
            aria-label="Next period"
          >
            <LuChevronRight className="text-[1.35rem] text-gray-500" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-end gap-1">{rightActions}</div>
    </div>
  );
}
