import SearchUnit from "@/app/shared/components/search-unit/SearchUnit";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
