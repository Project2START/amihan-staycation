/**
 * Determines whether the given date represents today's date.
 * Both dates are compared at the start-of-day level (midnight) to ensure
 * time-of-day does not affect the comparison.
 *
 * @param dateToCheck - The date to check.
 * @returns `true` if the provided date is the same day as today, otherwise `false`.
 */

export function isToday(dateToCheck: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today.getTime() === dateToCheck.getTime();
}
