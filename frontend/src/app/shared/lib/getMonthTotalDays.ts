/**
 * Returns the total number of days in a given month.
 * Uses JavaScript's date rollover behavior by creating a date for the
 * 0th day of the next month, which corresponds to the last day of the target month.
 *
 * @param year - The full year (e.g., 2025).
 * @param month - The zero-based month index (0 = January, 11 = December).
 * @returns The number of days in the specified month.
 */

export function getMonthTotalDays(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
