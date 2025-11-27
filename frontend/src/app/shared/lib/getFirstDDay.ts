export function getFirstDDay(): number {
  const CURRENT_DATE = new Date();

  CURRENT_DATE.setDate(1);

  return CURRENT_DATE.getDay();
}
