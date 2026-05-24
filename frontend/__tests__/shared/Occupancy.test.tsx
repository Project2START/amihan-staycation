import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Occupancy from "@/app/shared/components/search-unit/Occupancy";

describe("Occupancy component", () => {
  it("updates occupancy counts and calls onSetSearch on Done", async () => {
    const onSetSearch = jest.fn();
    const onSetOccupancy = jest.fn();

    render(
      <Occupancy
        search={{ checkIn: "", checkOut: "", adults: 1, children: 0, rooms: 1 }}
        onSetSearch={onSetSearch}
        onSetOccupancy={onSetOccupancy}
      />,
    );

    // find all plus buttons
    const plusButtons = screen
      .getAllByRole("button")
      .filter((b) => b.textContent === "+");

    // increment adults and children by clicking plus twice
    if (plusButtons.length >= 2) {
      await userEvent.click(plusButtons[0]);
      await userEvent.click(plusButtons[1]);
    }

    const done = screen.getByRole("button", { name: /done/i });
    await userEvent.click(done);

    expect(onSetSearch).toHaveBeenCalledWith(
      expect.objectContaining({
        adults: expect.any(Number),
        children: expect.any(Number),
      }),
    );
    expect(onSetOccupancy).toHaveBeenCalledWith(false);
  });
});
