import { Dayjs } from "dayjs";

export type ViewMode =
  | "yearly"
  | "monthly"
  | "weekly"
  | "daily"
  | "custom"
  | "all";

export type BookingRow = {
  id: string;
  status: string;
  createdAt?: string | null;
  guest_count: number | null;
  check_period: {
    check_in: string | null;
    check_out: string | null;
  } | null;
  product: {
    id: string | null;
    name: string | null;
    price: number | null;
    maxPersons: number | null;
  } | null;
};

export type InsightsRange = {
  start: Dayjs;
  end: Dayjs;
  label: string;
  xAxisLabel: string;
};

export type BookingTrendDatum = {
  key: string;
  label: string;
  tooltipLabel: string;
  value: number;
};

export type BookingsPerUnitDatum = {
  name: string;
  value: number;
  color: string;
  isPlaceholder?: boolean;
};

export type UnitOption = {
  id: string;
  name: string;
};

export type InsightsMetrics = {
  totalRevenue: number;
  totalBookings: number;
  occupancyRate: number;
  totalGuestsHosted: number;
};

export type OccupancyStats = {
  bookedNights: number;
  totalNightsInRange: number;
  totalNightsAvailable: number;
  occupancyRate: number;
};
