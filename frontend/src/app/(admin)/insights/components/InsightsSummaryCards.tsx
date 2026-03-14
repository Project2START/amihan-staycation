import { InsightsMetrics } from "../lib/insights.types";
import TotalRevenueCard from "./cards/TotalRevenueCard";
import BookingsOccupancyCards from "./cards/BookingsOccupancyCards";
import GuestsHostedCard from "./cards/GuestsHostedCard";

interface InsightsSummaryCardsProps {
  metrics: InsightsMetrics;
}

export default function InsightsSummaryCards({
  metrics,
}: InsightsSummaryCardsProps) {
  return (
    <div className="mt-[1.1rem] space-y-3">
      <TotalRevenueCard totalRevenue={metrics.totalRevenue} />
      <BookingsOccupancyCards
        totalBookings={metrics.totalBookings}
        occupancyRate={metrics.occupancyRate}
      />
      <GuestsHostedCard totalGuestsHosted={metrics.totalGuestsHosted} />
    </div>
  );
}
