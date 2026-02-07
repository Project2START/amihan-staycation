/**
 * Returns a Date offset from today by a given amount and time unit.
 */

export function getDateOffsetFromToday(
  amount: number,
  unit: "days" | "weeks" | "months" | "years",
): Date {
  const result = new Date(); // start from today

  switch (unit) {
    case "days":
      result.setDate(result.getDate() + amount);
      break;

    case "weeks":
      result.setDate(result.getDate() + amount * 7);
      break;

    case "months":
      result.setMonth(result.getMonth() + amount);
      break;

    case "years":
      result.setFullYear(result.getFullYear() + amount);
      break;

    default:
      throw new Error(`Unsupported unit: ${unit}`);
  }

  return result;
}
