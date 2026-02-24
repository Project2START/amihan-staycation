// bookings/page.tsx
"use client";

import { useState, useEffect } from "react";
import HeaderAdmin from "@/app/(admin)/components/HeaderAdmin";
import NavigationBottomAdmin from "@/app/(admin)/spaces/components/NavigationBottomSpaces";
import BookingFiltersNav, {
  type BookingCounts,
} from "./components/BookingFiltersNav";
import { BookingStatus } from "./constants/bookingFilters";

export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState<BookingStatus>("all");
  const [counts, setCounts] = useState<BookingCounts>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch booking counts on component mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Replace with your actual API call
        // const response = await fetch('/api/bookings/counts');
        // const data = await response.json();

        // Mock data for demonstration
        const mockCounts: BookingCounts = {
          all: 24,
          pending: 5,
          confirmed: 8,
          "checked-in": 3,
          "checked-out": 8,
          "action-needed": 2,
        };

        setCounts(mockCounts);
      } catch (error) {
        console.error("Failed to fetch booking counts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Handle filter change
  const handleFilterChange = async (status: BookingStatus) => {
    setActiveFilter(status);

    try {
      console.log(`Filtering bookings by: ${status}`);
      // Optional: Fetch filtered bookings from API
      // const params = status !== "all" ? { status } : {};
      // const response = await fetch(`/api/bookings`, { params });
      // const data = await response.json();
      // Handle filtered data as needed
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header - Sticky at top */}
      <div className="sticky top-0 z-50 shadow-md">
        <HeaderAdmin />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Booking Management Header - Scrollable (NOT sticky) */}
        <div
          style={{ backgroundColor: "#0B5173" }}
          className="text-white px-6 py-10 shadow-lg"
        >
          <div className="w-full flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-2 text-center">
              Booking Management
            </h1>
            <p className="text-blue-50 text-lg text-center">
              All Your Bookings. One Place to Manage Them All.
            </p>
          </div>
        </div>

        {/* Filter Navigation - Sticky */}
        <div className="sticky top-[80px] z-40 bg-white px-6 py-6 border-b border-gray-200 shadow-sm">
          <div className="w-full flex justify-center">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
                  style={{
                    borderTopColor: "#009EA9",
                    borderBottomColor: "#009EA9",
                  }}
                ></div>
              </div>
            ) : (
              <BookingFiltersNav
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                counts={counts}
                showIcons={true}
                className="px-0 py-0 bg-transparent border-0"
              />
            )}
          </div>
        </div>

        {/* Content Area - Ready for your content */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center min-h-96 flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {activeFilter === "all"
                ? "All Bookings"
                : activeFilter === "pending"
                  ? "Pending Bookings"
                  : activeFilter === "confirmed"
                    ? "Confirmed Bookings"
                    : activeFilter === "checked-in"
                      ? "Checked-In Guests"
                      : activeFilter === "checked-out"
                        ? "Checked-Out Bookings"
                        : "Action Needed"}
            </h2>
            <p className="text-gray-600 mb-6">
              Your booking content will be displayed here.
            </p>
            <p className="text-sm text-gray-500">
              Currently filtering by:{" "}
              <span className="font-semibold">{activeFilter}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <NavigationBottomAdmin />
    </div>
  );
}
