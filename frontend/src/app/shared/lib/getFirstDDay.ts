/**
 * Returns the weekday index (0–6) of the first day of the current month.
 * 0 = Sunday, 1 = Monday, ..., 6 = Saturday.
 * This is useful for calendar rendering to know which day the month starts on.
 *
 * @returns {number} The weekday index of the 1st day of the current month.
 */

export function getFirstDDay(): number {
  const CURRENT_DATE = new Date();

  CURRENT_DATE.setDate(1);

  return CURRENT_DATE.getDay();
}
