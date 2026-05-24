import React from "react";
import { render, screen } from "@testing-library/react";
import MyBookingsList from "@/app/(admin)/my-bookings/components/MyBookingsList";

describe("MyBookingsList", () => {
  it("renders booking items from data", () => {
    const now = new Date().toISOString();
    const data = {
      bookingsByAdmin: [
        {
          id: "1",
          name: "Bob",
          contact_number: "321",
          check_period: { check_in: now, check_out: now },
          product: { name: "Suite" },
          status: "confirmed",
        },
      ],
    } as any;

    render(<MyBookingsList data={data} />);

    expect(screen.getByText(/bob/i)).toBeInTheDocument();
    expect(screen.getByText(/suite/i)).toBeInTheDocument();
  });
});
