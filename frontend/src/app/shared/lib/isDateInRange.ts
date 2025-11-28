/**
 * Checks whether a given date falls strictly between a start and end date.
 * All inputs are converted to `Date` objects for comparison.
 *
 * @param startDate - The beginning of the date range (inclusive boundary is NOT included).
 * @param endDate - The end of the date range (exclusive boundary is NOT included).
 * @param subjectDate - The date being tested.
 * @returns `true` if the subject date is between the start and end dates (not equal to either).
 */

export function isDateInRange(
  startDate: string,
  endDate: string,
  subjectDate: string
) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const date = new Date(subjectDate);

  return date > start && date < end;
}
