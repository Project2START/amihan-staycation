import { isDatePast } from "@/app/shared/lib/isDatePast";

describe("isDatePast", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    // Freeze time to 2025-12-05 at local midnight
    jest.setSystemTime(new Date(2025, 11, 5, 0, 0, 0));
    // (month 11 is December because JS months are 0-based)
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("returns true for a date before today", () => {
    const pastDate = new Date(2025, 11, 4); // Dec 4, 2025 local
    expect(isDatePast(pastDate)).toBe(true);
  });

  it("returns false for today", () => {
    const todayDate = new Date(); // Dec 5, 2025 local
    expect(isDatePast(todayDate)).toBe(false);
  });

  it("returns false for a future date", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 1); // always tomorrow

    expect(isDatePast(futureDate)).toBe(false);
  });
});
