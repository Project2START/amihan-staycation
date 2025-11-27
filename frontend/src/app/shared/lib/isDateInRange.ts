export function isDateInRange(
  startDate: string,
  endDate: string,
  subjectDate: string
) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const date = new Date(subjectDate);

  return date > start && date < end;
}
