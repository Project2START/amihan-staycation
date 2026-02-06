export const initialMonth = new Date("2025-10-01");

export function formatMonthYear(date: Date) {
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}

export function getPreviousMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

export function getNextMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}
