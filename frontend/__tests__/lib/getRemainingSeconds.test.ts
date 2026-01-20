import { getRemainingSeconds } from "@/app/shared/lib/getRemainingSeconds";

describe("getRemainingSeconds", () => {
  const REAL_DATE_NOW = Date.now;

  beforeEach(() => {
    // Freeze "now" to 2025-12-05T12:00:00Z
    const frozenNow = new Date("2025-12-05T12:00:00Z").getTime();
    Date.now = jest.fn(() => frozenNow);
  });

  afterEach(() => {
    // Restore original Date.now
    Date.now = REAL_DATE_NOW;
  });

  it("returns the correct remaining seconds for a future date", () => {
    const now = new Date(Date.now());

    const future10s = new Date(now.getTime() + 10 * 1000).toISOString();
    expect(getRemainingSeconds(future10s)).toBe(10);

    const future5m = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
    expect(getRemainingSeconds(future5m)).toBe(300); // 5 minutes
  });

  it("returns negative seconds for a past date", () => {
    const now = new Date(Date.now());

    const past10s = new Date(now.getTime() - 10 * 1000).toISOString();
    expect(getRemainingSeconds(past10s)).toBe(-10);
  });

  it("returns 0 for the exact current time", () => {
    const nowISO = new Date(Date.now()).toISOString();
    expect(getRemainingSeconds(nowISO)).toBe(0);
  });
});
