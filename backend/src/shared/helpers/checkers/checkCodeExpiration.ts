/**
 * Checks whether a given code or token has expired.
 *
 * @param codeExpiry - The expiration date/time of the code.
 * @returns `true` if the current date/time is equal to or past the expiration, otherwise `false`.
 */

export function checkCodeExpiration(codeExpiry: Date): boolean {
  return new Date() >= codeExpiry;
}
