export function isToday(dateToCheck: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today.getTime() === dateToCheck.getTime();
}
