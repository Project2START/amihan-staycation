import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Calendar from "@/app/shared/components/search-unit/Calendar";

describe("Calendar component", () => {
  it("enables Done after selecting two dates and calls onSetSearch", async () => {
    const onSetSearch = jest.fn();
    const onSetCalendar = jest.fn();

    render(
      <Calendar
        search={{ checkIn: "", checkOut: "", adults: 1, children: 0, rooms: 1 }}
        onSetSearch={onSetSearch}
        onSetCalendar={onSetCalendar}
      />,
    );

    // find numeric date buttons (exclude prev/next and Done)
    const allButtons = screen.getAllByRole("button");
    const dateButtons = allButtons.filter((b) =>
      /^\d+$/.test(b.textContent || ""),
    );

    // click first two enabled date buttons
    const enabledDates = dateButtons.filter((b) => !b.hasAttribute("disabled"));
    if (enabledDates.length < 2)
      throw new Error("Not enough enabled date buttons for test");

    await userEvent.click(enabledDates[0]);
    await userEvent.click(enabledDates[1]);

    const doneButton = screen.getByRole("button", { name: /done/i });
    expect(doneButton).not.toBeDisabled();

    await userEvent.click(doneButton);

    expect(onSetSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        checkIn: expect.any(String),
        checkOut: expect.any(String),
      }),
    );
    expect(onSetCalendar).toHaveBeenCalledWith(false);
  });
});
