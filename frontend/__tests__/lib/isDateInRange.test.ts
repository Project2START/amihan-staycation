import { isDateInRange } from "@/app/shared/lib/isDateInRange";

describe("isDateInRange", () => {
  const start = "2025-12-01T00:00:00Z";
  const end = "2025-12-31T23:59:59Z";

  it("returns true when the subject date is strictly between start and end", () => {
    const subject = "2025-12-15T12:00:00Z";
    expect(isDateInRange(start, end, subject)).toBe(true);
  });

  it("returns false when the subject date is equal to the start date", () => {
    const subject = "2025-12-01T00:00:00Z";
    expect(isDateInRange(start, end, subject)).toBe(false);
  });

  it("returns false when the subject date is equal to the end date", () => {
    const subject = "2025-12-31T23:59:59Z";
    expect(isDateInRange(start, end, subject)).toBe(false);
  });

  it("returns false when the subject date is before the start date", () => {
    const subject = "2025-11-30T23:59:59Z";
    expect(isDateInRange(start, end, subject)).toBe(false);
  });

  it("returns false when the subject date is after the end date", () => {
    const subject = "2026-01-01T00:00:00Z";
    expect(isDateInRange(start, end, subject)).toBe(false);
  });
});
