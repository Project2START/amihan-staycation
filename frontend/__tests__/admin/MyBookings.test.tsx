import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MyBookings from "@/app/(admin)/my-bookings/components/MyBookings";

jest.mock("@apollo/client/react", () => ({
  useQuery: jest.fn(),
}));

jest.mock("../../src/app/shared/components/ErrorClient", () => (props: any) => (
  <div>
    <span>{props.message}</span>
    <button onClick={props.onRetry}>Retry</button>
  </div>
));

const { useQuery } = require("@apollo/client/react");

describe("MyBookings component", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("shows skeletons when loading", () => {
    (useQuery as jest.Mock).mockReturnValue({ loading: true });

    render(<MyBookings />);

    // Skeletons don't have accessible labels; ensure refresh not present
    expect(
      screen.queryByRole("button", { name: /refresh/i }),
    ).not.toBeInTheDocument();
  });

  it("shows error client when query errors and retry calls refetch", async () => {
    const refetch = jest.fn();
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: new Error("boom"),
      refetch,
    });

    render(<MyBookings />);

    expect(
      screen.getByText(/something went wrong. please try again later./i),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /retry/i }));

    expect(refetch).toHaveBeenCalled();
  });

  it("shows empty state when bookings array is empty", () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      data: { bookingsByAdmin: [] },
    });

    render(<MyBookings />);

    expect(
      screen.getByText(/you currently have no bookings/i),
    ).toBeInTheDocument();
  });

  it("renders bookings list and refresh button when data is present", async () => {
    const refetch = jest.fn();
    const now = new Date().toISOString();
    const data = {
      bookingsByAdmin: [
        {
          id: "1",
          name: "Alice",
          contact_number: "123",
          check_period: { check_in: now, check_out: now },
          product: { name: "Room" },
          status: "pending",
        },
      ],
    };

    (useQuery as jest.Mock).mockReturnValue({ loading: false, data, refetch });

    render(<MyBookings />);

    expect(
      screen.getByRole("button", { name: /refresh/i }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /refresh/i }));

    expect(refetch).toHaveBeenCalled();
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
  });
});
