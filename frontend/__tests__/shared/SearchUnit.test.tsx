import SearchUnit from "@/app/shared/components/search-unit/SearchUnit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("../../src/app/shared/components/CalendarBooking", () => () => (
  <div data-testid="calendar-booking-mock">calendar</div>
));

describe("SearchUnit Component", () => {
  let dateRangeButton: HTMLInputElement;
  let occupancyButton: HTMLInputElement;

  beforeEach(() => {
    render(<SearchUnit />);
    dateRangeButton = screen.getByLabelText("date-range-button");
    occupancyButton = screen.getByLabelText("occupancy-button");
  });
  it("shows the calendar when date range button clicks", async () => {
    expect(screen.queryByTestId("search-calendar")).toBeNull();

    await userEvent.click(dateRangeButton);

    expect(screen.queryByTestId("search-calendar")).toBeInTheDocument();
  });
  it("shows the occupancy panel when occupancy button clicks", async () => {
    expect(screen.queryByTestId("search-occupancy")).toBeNull();

    await userEvent.click(occupancyButton);

    expect(screen.queryByTestId("search-occupancy")).toBeInTheDocument();
  });
});
