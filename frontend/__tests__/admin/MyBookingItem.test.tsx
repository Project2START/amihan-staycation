import React from "react";
import { render, screen } from "@testing-library/react";
import MyBookingItem from "@/app/(admin)/my-bookings/components/MyBookingItem";
import dayjs from "dayjs";

describe("MyBookingItem", () => {
  it("displays booking details and formatted dates", () => {
    const checkIn = new Date(2023, 0, 15).toISOString();
    const checkOut = new Date(2023, 0, 18).toISOString();

    render(
      <MyBookingItem
        name="Charlie"
        contact_number="555"
        check_in={checkIn}
        check_out={checkOut}
        status={"confirmed" as any}
        product_name="Deluxe"
      />,
    );

    expect(screen.getByText(/charlie/i)).toBeInTheDocument();
    expect(screen.getByText(/deluxe/i)).toBeInTheDocument();
    // check formatted month/day appears
    expect(
      screen.getByText(dayjs(checkIn).format("MMMM DD")),
    ).toBeInTheDocument();
  });
});
