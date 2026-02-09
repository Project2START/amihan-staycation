import dayjs from "dayjs";

export function getDateList(
  startDate: string,
  endDate: string,
): string[] | string {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!isoDatePattern.test(startDate) || !isoDatePattern.test(endDate)) {
    return "Invalid date format. Use YYYY-MM-DD";
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) {
    return "Invalid date value.";
  }

  if (start.isAfter(end)) {
    return "Start date cannot be later than end date.";
  }

  const dates: string[] = [];
  let current = start;

  while (current.isSame(end) || current.isBefore(end)) {
    dates.push(current.format("YYYY-MM-DD"));
    current = current.add(1, "day");
  }

  return dates;
}
