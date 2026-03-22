import { BookingTrendDatum, BookingsPerUnitDatum } from "../lib/insights.types";
import BookingTrendsChart from "./charts/BookingTrendsChart";
import BookingsPerUnitChart from "./charts/BookingsPerUnitChart";

interface InsightsOverviewSectionProps {
  bookingTrendData: BookingTrendDatum[];
  bookingsPerUnitData: BookingsPerUnitDatum[];
  xAxisLabel: string;
  revenueMax: number;
  revenueTickStep: number;
  bookingsPerUnitMax: number;
  bookingTickStep: number;
}

export default function InsightsOverviewSection({
  bookingTrendData,
  bookingsPerUnitData,
  xAxisLabel,
  revenueMax,
  revenueTickStep,
  bookingsPerUnitMax,
  bookingTickStep,
}: InsightsOverviewSectionProps) {
  return (
    <div className="mt-6 pb-6">
      <h2 className="text-center font-bold text-secondary-normal uppercase lg:text-3xl">
        Overview
      </h2>

      <BookingTrendsChart
        data={bookingTrendData}
        xAxisLabel={xAxisLabel}
        yMax={revenueMax}
        yTickStep={revenueTickStep}
      />

      <BookingsPerUnitChart
        data={bookingsPerUnitData}
        yMax={bookingsPerUnitMax}
        yTickStep={bookingTickStep}
      />
    </div>
  );
}
