// components/BookingFiltersNav.tsx
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  BOOKING_FILTERS,
  BookingStatus,
  type FilterOption,
} from "../constants/bookingFilters";
import FilterButton from "./FilterButton";

export interface BookingCounts {
  all?: number;
  pending?: number;
  confirmed?: number;
  "checked-in"?: number;
  "checked-out"?: number;
  "action-needed"?: number;
  [key: string]: number | undefined;
}

interface BookingFiltersNavProps {
  /**
   * Current active filter status
   */
  activeFilter: BookingStatus;

  /**
   * Callback when filter changes
   */
  onFilterChange: (status: BookingStatus) => void;

  /**
   * Optional counts for each status
   * Displays count badge on each filter button
   */
  counts?: BookingCounts;

  /**
   * Show icons in buttons (default: true)
   */
  showIcons?: boolean;

  /**
   * Custom styling for the container
   */
  className?: string;

  /**
   * Custom scroll behavior (default: smooth)
   */
  scrollBehavior?: "smooth" | "auto";
}

export default function BookingFiltersNav({
  activeFilter,
  onFilterChange,
  counts,
  showIcons = true,
  className = "",
  scrollBehavior = "smooth",
}: BookingFiltersNavProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleFilterClick = useCallback(
    (status: BookingStatus) => {
      onFilterChange(status);
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 300);
    },
    [onFilterChange]
  );

  // Check if scroll is possible
  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  // Scroll handler
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  // Display all filters
  const filterOptions = BOOKING_FILTERS;

  return (
    <div
      className={`
        w-full relative
        ${className}
      `}
    >
      {/* Mobile/Tablet: Horizontal Scrollable Gallery */}
      <div className="lg:hidden flex items-center gap-2">
        {/* Left Scroll Button - Hidden on desktop */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="flex-shrink-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll left"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Horizontal Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex-1 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollBehavior: scrollBehavior as any }}
        >
          <div className="flex gap-2 pb-2">
            {filterOptions.map((filter: FilterOption) => (
              <div key={filter.id} className="flex-shrink-0">
                <FilterButton
                  filter={filter}
                  isActive={activeFilter === filter.id}
                  count={counts?.[filter.id]}
                  onClick={handleFilterClick}
                  showIcon={showIcons}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Scroll Button - Hidden on desktop */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="flex-shrink-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Scroll right"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Desktop: Centered Grid Layout */}
      <div
        className={`
          hidden lg:flex gap-3 justify-center flex-wrap
          ${isScrolling ? "scroll-smooth" : ""}
        `}
        style={{ scrollBehavior: scrollBehavior as any }}
      >
        {filterOptions.map((filter: FilterOption) => (
          <FilterButton
            key={filter.id}
            filter={filter}
            isActive={activeFilter === filter.id}
            count={counts?.[filter.id]}
            onClick={handleFilterClick}
            showIcon={showIcons}
          />
        ))}
      </div>
    </div>
  );
}