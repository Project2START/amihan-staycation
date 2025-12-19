import { isToday } from "@/app/shared/lib/isToday";

describe("isToday", () => {
  beforeAll(() => {
    jest.useFakeTimers();

    // Freeze time to Dec 5, 2025 at local midnight
    jest.setSystemTime(new Date(2025, 11, 5, 0, 0, 0));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("returns true for today at midnight", () => {
    const today = new Date(); // mocked date -> Dec 5, 2025 at midnight
    expect(isToday(today)).toBe(true);
  });

  it("returns false for today but with a time later in the day", () => {
    const todayLater = new Date();
    todayLater.setHours(15, 30, 0, 0); // still Dec 5, but not midnight

    expect(isToday(todayLater)).toBe(false);
  });

  it("returns false for a date before today", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // always Dec 4, 2025

    expect(isToday(yesterday)).toBe(false);
  });

  it("returns false for a future date", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // always Dec 6, 2025

    expect(isToday(tomorrow)).toBe(false);
  });
});
