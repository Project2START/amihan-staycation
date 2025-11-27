export function checkCodeExpiration(codeExpiry: Date): boolean {
  return new Date() >= codeExpiry;
}
