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
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="col-span-2 md:col-span-1">
                <TotalRevenueCard totalRevenue={insights.totalRevenue} />
              </div>

              <div className="col-span-1 md:col-span-1">
                <TotalBookingsCard totalBookings={insights.totalBookings} />
              </div>

              <div className="col-span-1 md:col-span-1">
                <OccupancyRateCard occupancyRate={insights.occupancyRate} />
              </div>

              <div className="col-span-2 md:col-span-1">
                <TotalGuestsCard totalGuestsHosted={insights.totalGuestsHosted} />
              </div>
            </div>

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