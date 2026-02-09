import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function getDateOffsetFromToday(
  amount: number,
  unit: "days" | "weeks" | "months" | "years",
  tz: string = "Asia/Manila",
): Date {
  let result = dayjs().tz(tz).startOf("day");

  switch (unit) {
    case "days":
      result = result.add(amount, "day");
      break;
    case "weeks":
      result = result.add(amount, "week");
      break;
    case "months":
      result = result.add(amount, "month");
      break;
    case "years":
      result = result.add(amount, "year");
      break;
    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }

  return result.toDate();
}
