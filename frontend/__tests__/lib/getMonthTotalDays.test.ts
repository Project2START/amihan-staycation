import { getMonthTotalDays } from "@/app/shared/lib/getMonthTotalDays";

describe("getMonthTotalDays", () => {
  it("returns the correct number of days for each month", () => {
    // January has 31 days
    expect(getMonthTotalDays(2025, 0)).toBe(31);
    // February in a non-leap year has 28 days
    expect(getMonthTotalDays(2025, 1)).toBe(28);
    // February in a leap year has 29 days
    expect(getMonthTotalDays(2024, 1)).toBe(29);
    // April has 30 days
    expect(getMonthTotalDays(2025, 3)).toBe(30);
    // December has 31 days
    expect(getMonthTotalDays(2025, 11)).toBe(31);
  });

  it("handles edge cases correctly", () => {
    // Month index out of typical range (e.g., month = 12 means January of next year)
    expect(getMonthTotalDays(2025, 12)).toBe(31); // January 2026
    expect(getMonthTotalDays(2025, -1)).toBe(31); // December 2024
  });
});
