/**
 * Determines whether a given date occurs before today's date.
 * The comparison is done at the day level, with today's time set to midnight
 * to avoid time-of-day affecting the result.
 *
 * @param dateToCheck - The date to evaluate.
 * @returns `true` if the date is earlier than today, otherwise `false`.
 */

export function isDatePast(dateToCheck: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return dateToCheck < today;
}
