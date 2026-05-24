import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CalendarBooking from "@/app/shared/components/CalendarBooking";

jest.mock("@mantine/dates", () => ({
  DatePicker: ({
    onChange,
    excludeDate,
  }: {
    onChange: (value: [string, string]) => void;
    excludeDate?: (date: Date) => boolean;
  }) => (
    <div>
      <button
        type="button"
        onClick={() => onChange(["2026-04-01", "2026-04-03"])}
      >
        pick dates
      </button>
      <button
        type="button"
        onClick={() => onChange(["2026-04-02", null as unknown as string])}
      >
        pick disabled start
      </button>
      <button
        type="button"
        onClick={() => onChange(["2026-04-01", null as unknown as string])}
      >
        set start
      </button>
      <button
        type="button"
        onClick={() => onChange(["2026-04-01", "2026-04-05"])}
      >
        pick range through disabled
      </button>
      <button
        type="button"
        onClick={() => onChange(["2026-04-01", "2026-04-04"])}
      >
        pick range with blocked middle
      </button>
      <button
        type="button"
        onClick={() => onChange(["2026-04-01", "2026-04-03"])}
      >
        pick range with blocked end
      </button>
      <span data-testid="excluded-while-no-start">
        {excludeDate?.(new Date("2026-04-02")) ? "yes" : "no"}
      </span>
      <span data-testid="excluded-while-active-range">
        {excludeDate?.(new Date("2026-04-03")) ? "yes" : "no"}
      </span>
      <span data-testid="excluded-disabled-before-start">
        {excludeDate?.(new Date("2026-04-08")) ? "yes" : "no"}
      </span>
      <span data-testid="excluded-disabled-after-start">
        {excludeDate?.(new Date("2026-04-12")) ? "yes" : "no"}
      </span>
    </div>
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

  it("keeps disabled dates blocked as check-in starts", async () => {
    const onCalendarChange = jest.fn();

    render(
      <CalendarBooking
        defaultValue={[null, null]}
        hasPresets={false}
        disabledDates={[new Date("2026-04-02")]}
        onCalendarChange={onCalendarChange}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /pick disabled start/i }),
    );

    expect(onCalendarChange).not.toHaveBeenCalled();
  });

  it("allows disabled date as checkout boundary when selecting end date", async () => {
    const onCalendarChange = jest.fn();

    const { rerender } = render(
      <CalendarBooking
        defaultValue={[null, null]}
        hasPresets={false}
        disabledDates={[new Date("2026-04-02")]}
        onCalendarChange={onCalendarChange}
      />,
    );

    expect(screen.getByTestId("excluded-while-no-start")).toHaveTextContent(
      "yes",
    );

    await userEvent.click(screen.getByRole("button", { name: /set start/i }));

    rerender(
      <CalendarBooking
        defaultValue={["2026-04-01", null]}
        hasPresets={false}
        disabledDates={[new Date("2026-04-02")]}
        onCalendarChange={onCalendarChange}
      />,
    );

    expect(screen.getByTestId("excluded-while-no-start")).toHaveTextContent(
      "no",
    );
  });

  it("allows blocked checkout even when earlier blocked dates exist in the same range", async () => {
    const onCalendarChange = jest.fn();

    render(
      <CalendarBooking
        defaultValue={[null, null]}
        hasPresets={false}
        disabledDates={[
          new Date("2026-04-03"),
          new Date("2026-04-04"),
          new Date("2026-04-05"),
        ]}
        onCalendarChange={onCalendarChange}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /pick range through disabled/i }),
    );

    expect(onCalendarChange).toHaveBeenCalledWith(["2026-04-01", "2026-04-05"]);
  });

  it("keeps disabled in-range dates renderable when range is already selected", () => {
    const onCalendarChange = jest.fn();

    render(
      <CalendarBooking
        defaultValue={["2026-04-01", "2026-04-05"]}
        hasPresets={false}
        disabledDates={[new Date("2026-04-03")]}
        onCalendarChange={onCalendarChange}
      />,
    );

    expect(screen.getByTestId("excluded-while-active-range")).toHaveTextContent(
      "no",
    );
  });

  it("only allows disabled checkout candidates after an existing check-in", () => {
    const onCalendarChange = jest.fn();

    render(
      <CalendarBooking
        defaultValue={["2026-04-10", null]}
        hasPresets={false}
        disabledDates={[new Date("2026-04-08"), new Date("2026-04-12")]}
        onCalendarChange={onCalendarChange}
      />,
    );

    expect(
      screen.getByTestId("excluded-disabled-before-start"),
    ).toHaveTextContent("yes");
    expect(
      screen.getByTestId("excluded-disabled-after-start"),
    ).toHaveTextContent("no");
  });

  it("rejects range selections that have blocked middle dates", async () => {
    const onCalendarChange = jest.fn();

    render(
      <CalendarBooking
        defaultValue={[null, null]}
        hasPresets={false}
        disabledDates={[new Date("2026-04-03")]}
        onCalendarChange={onCalendarChange}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /pick range with blocked middle/i }),
    );

    expect(onCalendarChange).toHaveBeenCalledWith(["2026-04-01", null]);
  });

  it("allows blocked date only when it is the checkout boundary", async () => {
    const onCalendarChange = jest.fn();

    render(
      <CalendarBooking
        defaultValue={[null, null]}
        hasPresets={false}
        disabledDates={[new Date("2026-04-03")]}
        onCalendarChange={onCalendarChange}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /pick range with blocked end/i }),
    );

    expect(onCalendarChange).toHaveBeenCalledWith(["2026-04-01", "2026-04-03"]);
  });
});
