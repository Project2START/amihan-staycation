import dayjs, { Dayjs } from "dayjs";
import {
  BookingRow,
  BookingTrendDatum,
  BookingsPerUnitDatum,
  InsightsMetrics,
  OccupancyStats,
  InsightsRange,
  ViewMode,
} from "./insights.types";

export const MODE_LABELS: Record<ViewMode, string> = {
  yearly: "Yearly",
  monthly: "Monthly",
  weekly: "Weekly",
  daily: "Daily",
  custom: "Custom",
  all: "All",
};

export const ALL_BOOKING_STATUSES: { name: string; status: string }[] = [
  { name: "Pending", status: "pending" },
  { name: "Confirmed", status: "confirmed" },
  { name: "Checked-In", status: "checked_in" },
  { name: "Checked-Out", status: "checked_out" },
  { name: "Action Required", status: "action_required" },
  { name: "Cancelled", status: "cancelled" },
  { name: "Expired", status: "expired" },
];

export const UNIT_COLORS = [
  "#227E98",
  "#2B9473",
  "#225E98",
  "#737373",
  "#CE9928",
];

export const getRevenueChartMax = (maxValue: number) => {
  if (maxValue <= 25000) return 25000;
  if (maxValue <= 50000) return Math.ceil(maxValue / 5000) * 5000;
  return Math.ceil(maxValue / 10000) * 10000;
};

export const getYAxisStep = (maxValue: number, baseStep: number) => {
  if (maxValue <= 0) return baseStep;
  return Math.max(baseStep, Math.ceil(maxValue / 5 / baseStep) * baseStep);
};

export const getCurrentRange = (
  viewMode: ViewMode,
  anchorDate: Dayjs,
  customStart: string,
  customEnd: string,
): InsightsRange => {
  if (viewMode === "all") {
    return {
      start: dayjs("2020-01-01").startOf("year"),
      end: dayjs().endOf("year"),
      label: "All Time",
      xAxisLabel: "Year",
    };
  }

  if (viewMode === "custom" && customStart && customEnd) {
    const start = dayjs(customStart).startOf("day");
    const end = dayjs(customEnd).endOf("day");
    const sameYear = start.isSame(end, "year");
    const sameMonth = start.isSame(end, "month");

    return {
      start,
      end,
      label: sameYear
        ? sameMonth
          ? `${start.format("MMM D")} - ${end.format("D, YYYY")}`
          : `${start.format("MMM D")} - ${end.format("MMM D, YYYY")}`
        : `${start.format("MMM D, YYYY")} - ${end.format("MMM D, YYYY")}`,
      xAxisLabel: "Custom Range",
    };
  }

  if (viewMode === "yearly") {
    return {
      start: anchorDate.startOf("year"),
      end: anchorDate.endOf("year"),
      label: anchorDate.format("YYYY"),
      xAxisLabel: "Month",
    };
  }

  if (viewMode === "weekly") {
    const start = anchorDate.startOf("week");
    const end = anchorDate.endOf("week");
    return {
      start,
      end,
      label: `${start.format("MMM D")} - ${end.format("MMM D, YYYY")}`,
      xAxisLabel: "Day of the Week",
    };
  }

  if (viewMode === "daily") {
    return {
      start: anchorDate.startOf("day"),
      end: anchorDate.endOf("day"),
      label: anchorDate.format("MMMM D, YYYY"),
      xAxisLabel: "Day",
    };
  }

  return {
    start: anchorDate.startOf("month"),
    end: anchorDate.endOf("month"),
    label: anchorDate.format("MMMM, YYYY"),
    xAxisLabel: "Day of the Month",
  };
};

export const filterBookingsByRange = (
  bookings: BookingRow[],
  range: InsightsRange,
): BookingRow[] => {
  return bookings.filter((booking) => {
    const checkIn = booking.check_period?.check_in;
    if (!checkIn) return false;
    const checkInDate = dayjs(checkIn);
    return (
      (checkInDate.isAfter(range.start) ||
        checkInDate.isSame(range.start, "day")) &&
      (checkInDate.isBefore(range.end) || checkInDate.isSame(range.end, "day"))
    );
  });
};

export const filterCheckedOutBookings = (
  bookings: BookingRow[],
  range: InsightsRange,
) => {
  return bookings.filter((booking) => {
    if (booking.status !== "checked_out") return false;
    const checkout = booking.check_period?.check_out;
    if (!checkout) return false;

    const checkoutDate = dayjs(checkout);
    return (
      (checkoutDate.isAfter(range.start) ||
        checkoutDate.isSame(range.start, "day")) &&
      (checkoutDate.isBefore(range.end) ||
        checkoutDate.isSame(range.end, "day"))
    );
  });
};

export const computeMetrics = (bookings: BookingRow[]): InsightsMetrics => {
  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + (booking.product?.price ?? 0),
    0,
  );

  const totalBookings = bookings.length;

  const totalGuestsHosted = bookings.reduce(
    (sum, booking) => sum + (booking.guest_count ?? 1),
    0,
  );

  return {
    totalRevenue,
    totalBookings,
    occupancyRate: 0,
    totalGuestsHosted,
  };
};

export const computeOccupancyStats = (
  bookings: BookingRow[],
  range: InsightsRange,
  totalUnits: number,
): OccupancyStats => {
  const periodStart = range.start.startOf("day");
  const periodEndExclusive = range.end.startOf("day").add(1, "day");
  const totalNightsInRange = periodEndExclusive.diff(periodStart, "day");

  if (totalUnits <= 0 || totalNightsInRange <= 0) {
    return {
      bookedNights: 0,
      totalNightsInRange,
      totalNightsAvailable: 0,
      occupancyRate: 0,
    };
  }

  const bookedNights = bookings.reduce((sum, booking) => {
    if (booking.status !== "checked_out") {
      return sum;
    }

    const checkInRaw = booking.check_period?.check_in;
    const checkOutRaw = booking.check_period?.check_out;

    if (!checkInRaw || !checkOutRaw) {
      return sum;
    }

    const bookingStart = dayjs(checkInRaw).startOf("day");
    const bookingEndExclusive = dayjs(checkOutRaw).startOf("day");

    const overlapStart = bookingStart.isAfter(periodStart)
      ? bookingStart
      : periodStart;
    const overlapEnd = bookingEndExclusive.isBefore(periodEndExclusive)
      ? bookingEndExclusive
      : periodEndExclusive;

    const overlapNights = Math.max(0, overlapEnd.diff(overlapStart, "day"));
    return sum + overlapNights;
  }, 0);

  const totalNightsAvailable = totalUnits * totalNightsInRange;

  if (totalNightsAvailable <= 0) {
    return {
      bookedNights,
      totalNightsInRange,
      totalNightsAvailable,
      occupancyRate: 0,
    };
  }

  return {
    bookedNights,
    totalNightsInRange,
    totalNightsAvailable,
    occupancyRate: Math.round((bookedNights / totalNightsAvailable) * 100),
  };
};

export const computeOccupancyRate = (
  bookings: BookingRow[],
  range: InsightsRange,
  totalUnits: number,
) => {
  return computeOccupancyStats(bookings, range, totalUnits).occupancyRate;
};

export const buildBookingTrendData = (
  bookings: BookingRow[],
  range: InsightsRange,
  viewMode: ViewMode,
): BookingTrendDatum[] => {
  const buckets: BookingTrendDatum[] = [];

  if (viewMode === "all") {
    const startYear = range.start.year();
    const endYear = range.end.year();
    for (let y = startYear; y <= endYear; y++) {
      buckets.push({
        key: String(y),
        label: String(y),
        tooltipLabel: `Year ${y}`,
        value: 0,
      });
    }
  } else if (viewMode === "yearly") {
    for (let i = 0; i < 12; i++) {
      const month = range.start.startOf("year").add(i, "month");
      buckets.push({
        key: month.format("YYYY-MM"),
        label: month.format("MMM"),
        tooltipLabel: month.format("MMMM YYYY"),
        value: 0,
      });
    }
  } else {
    const cursorStart = range.start.startOf("day");
    const cursorEnd = range.end.startOf("day");
    let cursor = cursorStart;

    while (cursor.isBefore(cursorEnd) || cursor.isSame(cursorEnd, "day")) {
      const monthlyTick = [1, 5, 10, 15, 20, 25, 31].includes(
        Number(cursor.format("D")),
      );

      buckets.push({
        key: cursor.format("YYYY-MM-DD"),
        label:
          viewMode === "monthly"
            ? monthlyTick
              ? cursor.format("D")
              : ""
            : viewMode === "weekly"
              ? cursor.format("ddd")
              : viewMode === "daily"
                ? cursor.format("MMM D")
                : cursor.format("MMM D"),
        tooltipLabel: cursor.format("MMMM D, YYYY"),
        value: 0,
      });

      cursor = cursor.add(1, "day");
    }
  }

  const map = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const booking of bookings) {
    const checkOut = booking.check_period?.check_out;
    if (!checkOut) continue;

    const d = dayjs(checkOut);
    const key =
      viewMode === "all"
        ? d.format("YYYY")
        : viewMode === "yearly"
          ? d.format("YYYY-MM")
          : d.format("YYYY-MM-DD");

    const bucket = map.get(key);
    if (bucket) {
      bucket.value += booking.product?.price ?? 0;
    }
  }

  return buckets;
};

export const buildBookingsPerUnitData = (
  bookings: BookingRow[],
): BookingsPerUnitDatum[] => {
  const unitMap = new Map<string, number>();

  for (const booking of bookings) {
    const unitName = booking.product?.name ?? "Unknown";
    unitMap.set(unitName, (unitMap.get(unitName) ?? 0) + 1);
  }

  const sorted = Array.from(unitMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .map((item, index) => ({
      ...item,
      color: UNIT_COLORS[index % UNIT_COLORS.length],
    }));

  if (sorted.length === 0) {
    return [
      {
        name: "",
        value: 0,
        color: "#227E98",
        isPlaceholder: true,
      },
    ];
  }

  return sorted;
};
