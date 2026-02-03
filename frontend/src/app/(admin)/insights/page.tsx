// insights/page.tsx
"use client";

import { useState } from "react";
import HeaderAdmin from "@/app/(admin)/components/HeaderAdmin";
import NavigationBottomAdmin from "@/app/(admin)/components/NavigationBottomSpaces";
import PageHeader from "./components/PageHeader";
import MonthSelector from "./components/MonthSelector";
import TotalRevenueCard from "./components/TotalRevenueCard";
import TotalBookingsCard from "./components/TotalBookingsCard";
import OccupancyRateCard from "./components/OccupancyRateCard";
import TotalGuestsCard from "./components/TotalGuestsCard";
import MonthlyOverview from "./components/MonthlyOverview";
import { initialInsights } from "./lib/insightsData";
import { initialMonth, formatMonthYear, getPreviousMonth, getNextMonth } from "./lib/monthHelpers";

export default function InsightsPage() {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [insights, setInsights] = useState(initialInsights);

  // Format month and year
  const monthYear = formatMonthYear(currentMonth);

  // Handle month navigation using helpers
  const handlePreviousMonth = () => {
    setCurrentMonth(getPreviousMonth(currentMonth));
  };

  const handleNextMonth = () => {
    setCurrentMonth(getNextMonth(currentMonth));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-50 shadow-md">
        <HeaderAdmin />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Header */}
        <PageHeader />

        {/* Month Selector */}
        <MonthSelector
          monthYear={monthYear}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Total Revenue Card */}
            <TotalRevenueCard totalRevenue={insights.totalRevenue} />

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-8">
              {/* Total Bookings Card */}
              <TotalBookingsCard totalBookings={insights.totalBookings} />

              {/* Occupancy Rate Card */}
              <OccupancyRateCard occupancyRate={insights.occupancyRate} />
            </div>

            {/* Total Guests Hosted */}
            <TotalGuestsCard totalGuestsHosted={insights.totalGuestsHosted} />

            {/* Additional Info Section */}
            <MonthlyOverview monthYear={monthYear} />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <NavigationBottomAdmin />
    </div>
  );
}