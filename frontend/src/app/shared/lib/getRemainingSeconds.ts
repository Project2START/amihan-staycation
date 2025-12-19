/**
 * Calculates how many whole seconds remain until a given future date/time.
 * Converts both the target date and the current time to milliseconds, then
 * returns the difference in seconds (rounded down).
 *
 * @param date - A date string parsable by the `Date` constructor.
 * @returns The number of remaining seconds until the given date.
 *          May be negative if the date has already passed.
 */

export function getRemainingSeconds(date: string) {
  const nextAllowedMs = new Date(date).getTime();
  const nowMs = Date.now();

  const remainingSeconds = Math.floor((nextAllowedMs - nowMs) / 1000);

  return remainingSeconds;
}
