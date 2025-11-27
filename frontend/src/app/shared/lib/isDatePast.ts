export function isDatePast(dateToCheck: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return dateToCheck < today;
}
