// components/FilterButton.tsx
"use client";

import { BookingStatus, FilterOption } from "../constants/bookingFilters";

interface FilterButtonProps {
  filter: FilterOption;
  isActive: boolean;
  count?: number;
  onClick: (status: BookingStatus) => void;
  showIcon?: boolean;
}

export default function FilterButton({
  filter,
  isActive,
  count,
  onClick,
  showIcon = true,
}: FilterButtonProps) {
  const Icon = filter.icon;

  // Colors
  const primaryColor = "#009EA9"; // Teal for inactive badges
  const activeColor = "#0B5173"; // Dark blue for active state

  return (
    <button
      onClick={() => onClick(filter.id)}
      style={
        isActive
          ? {
              backgroundColor: activeColor,
              borderColor: activeColor,
              color: "white",
            }
          : {
              backgroundColor: "white",
              borderColor: "#D1D5DB", // gray-300
              color: "#374151", // gray-700
            }
      }
      className={`
        relative px-5 py-2.5 rounded-full font-semibold text-sm
        transition-all duration-200 ease-out
        flex items-center gap-2 whitespace-nowrap
        border-2
        
        /* Hover state */
        hover:shadow-md hover:scale-105
        
        /* Focus state for accessibility */
        focus:outline-none focus:ring-2 focus:ring-offset-2
      `}
      title={filter.description}
      aria-pressed={isActive}
      aria-label={`Filter by ${filter.label}${count ? ` (${count})` : ""}`}
    >
      {/* Icon */}
      {showIcon && (
        <span className="flex items-center justify-center">
          <Icon size={16} />
        </span>
      )}

      {/* Label */}
      <span>{filter.label}</span>

      {/* Count Badge */}
      {count !== undefined && count > 0 && (
        <span
          style={
            isActive
              ? {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  color: "white",
                }
              : {
                  backgroundColor: primaryColor,
                  color: "white",
                }
          }
          className={`
            ml-1 inline-flex items-center justify-center
            min-w-[20px] h-5 px-1 rounded-full text-xs font-bold
          `}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}