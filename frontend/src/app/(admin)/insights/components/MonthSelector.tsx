import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";

interface MonthSelectorProps {
  monthYear: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export default function MonthSelector({
  monthYear,
  onPreviousMonth,
  onNextMonth,
}: MonthSelectorProps) {
  return (
    <div className="bg-white px-6 py-6 border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-6">
          {/* Previous Month Button */}
          <button
            onClick={onPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <FaChevronLeft className="text-gray-600" size={20} />
          </button>

          {/* Month Display */}
          <div className="flex items-center gap-3 min-w-[200px] justify-center">
            <SlCalender className="text-gray-600" size={20} />
            <span className="text-lg font-semibold text-gray-800">
              {monthYear}
            </span>
          </div>

          {/* Next Month Button */}
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <FaChevronRight className="text-gray-600" size={20} />
          </button>

          {/* Filter Button (Optional) */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-4">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
