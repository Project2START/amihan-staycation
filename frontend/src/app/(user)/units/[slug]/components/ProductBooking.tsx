"use client";

import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { useBookingStatus } from "../../../components/BookingStatusContext";

export default function ProductBooking({ productId }: { productId: string }) {
  const { booking } = useBookingStatus();

  const user = useAppSelector((state) => state.users.data);

  return (
    <div className="mt-[2.5rem] flex justify-center">
      {user?.role !== "agent" && booking && booking.status !== "cancelled" ? (
        <p className="text-reject-normal text-xs text-center">
          You’ve already got a booking in place, so another reservation isn’t
          available at the moment.
        </p>
      ) : (
        <Link
          href={user ? `/bookings?id=${productId}` : `/sign-in`}
          className="w-[80%] text-white bg-primary-normal font-bold rounded-lg py-[1rem] text-center text-xs"
        >
          Book Now
        </Link>
      )}
    </div>
  );
}
