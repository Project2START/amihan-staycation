import { getFirstDDay } from "@/app/shared/lib/getFirstDDay";

describe("getFirstDDay", () => {
  const RealDate = Date;

  function mockDate(isoDate: string) {
    // @ts-ignore
    global.Date = class extends RealDate {
      constructor() {
        super();
        return new RealDate(isoDate);
      }
    } as unknown as DateConstructor;
  }

  afterEach(() => {
    // Restore original Date
    global.Date = RealDate;
  });

  it("returns the correct weekday index for the first day of the month", () => {
    // March 2025, 1st is Saturday (6)
    mockDate("2025-03-15T12:00:00Z");
    expect(getFirstDDay()).toBe(6);

    // December 2025, 1st is Monday (1)
    mockDate("2025-12-10T12:00:00Z");
    expect(getFirstDDay()).toBe(1);

    // January 2025, 1st is Wednesday (3)
    mockDate("2025-01-20T12:00:00Z");
    expect(getFirstDDay()).toBe(3);
  });
});
