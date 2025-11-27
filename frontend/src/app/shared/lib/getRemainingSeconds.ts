export function getRemainingSeconds(date: string) {
  const nextAllowedMs = new Date(date).getTime();
  const nowMs = Date.now();

  const remainingSeconds = Math.floor((nextAllowedMs - nowMs) / 1000);

  return remainingSeconds;
}
