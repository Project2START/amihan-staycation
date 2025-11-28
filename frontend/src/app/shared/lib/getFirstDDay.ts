/**
 * Returns the day of the week (0–6) for the first day of the current month.
 * Useful for calendar rendering, where 0 = Sunday, 1 = Monday, etc.
 *
 * @returns The weekday index of the first day of the current month.
 */

export function getFirstDDay(): number {
  const CURRENT_DATE = new Date();

  CURRENT_DATE.setDate(1);

  return CURRENT_DATE.getDay();
}
