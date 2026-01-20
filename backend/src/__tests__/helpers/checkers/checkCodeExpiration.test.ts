import { checkCodeExpiration } from "../../../shared/helpers/checkers/checkCodeExpiration";

describe("checkCodeExpiration", () => {
  test("returns true when current time is past the expiration time", () => {
    const pastDate = new Date(Date.now() - 1000); // 1 second ago
    expect(checkCodeExpiration(pastDate)).toBe(true);
  });

  test("returns true when current time is exactly the expiration time", () => {
    const now = new Date();
    expect(checkCodeExpiration(now)).toBe(true);
  });

  test("returns false when current time is before the expiration time", () => {
    const futureDate = new Date(Date.now() + 1000); // 1 second later
    expect(checkCodeExpiration(futureDate)).toBe(false);
  });
});
