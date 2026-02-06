export interface BookingTrendPoint { day: string; sales: number }
export interface BookingsPerUnit { name: string; value: number }

export const bookingTrendsData: BookingTrendPoint[] = [
  { day: "1", sales: 25000 },
  { day: "5", sales: 30000 },
  { day: "10", sales: 20000 },
  { day: "15", sales: 28000 },
  { day: "20", sales: 22000 },
  { day: "25", sales: 35000 },
  { day: "30", sales: 18000 },
];

export const bookingsPerUnitData: BookingsPerUnit[] = [
  { name: "Standard", value: 21 },
  { name: "Deluxe", value: 17 },
  { name: "Normal", value: 13 },
  { name: "With Pool", value: 8 },
  { name: "Meal", value: 8 },
];

export const COLORS = ["#1B7A9C", "#2E9B5E", "#4A5F8F", "#6B6B6B", "#C9A961"];
