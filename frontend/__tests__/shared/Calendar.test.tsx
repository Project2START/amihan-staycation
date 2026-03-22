import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CalendarBooking from "@/app/shared/components/CalendarBooking";

jest.mock("@mantine/dates", () => ({
  DatePicker: ({
    onChange,
  }: {
    onChange: (value: [string, string]) => void;
  }) => (
    <button
      type="button"
      onClick={() => onChange(["2026-04-01", "2026-04-03"])}
    >
      pick dates
    </button>
  ),
}));

describe("Calendar component", () => {
  it("calls onCalendarChange when a range is selected", async () => {
    const onCalendarChange = jest.fn();

    render(
      <CalendarBooking
        defaultValue={[null, null]}
        hasPresets={false}
        onCalendarChange={onCalendarChange}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /pick dates/i }));

    expect(onCalendarChange).toHaveBeenCalledWith(["2026-04-01", "2026-04-03"]);
  });
});
