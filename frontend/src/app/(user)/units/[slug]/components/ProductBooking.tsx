"use client";

import { HOST } from "@/app/shared/constants/config";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import { useAppSelector } from "@/lib/hooks";
import { Skeleton } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
// import { useBookingStatus } from "../../../components/BookingStatusContext";

interface ExistingBooking {
  status: string | null;
  id: string | null;
}

export default function ProductBooking({ productId }: { productId: string }) {
  const [existingBooking, setExistingBooking] = useState<{
    booking: ExistingBooking | null;
    loading: boolean;
    error: string;
  }>({ booking: null, loading: false, error: "" });

  const user = useAppSelector((state) => state.users.data);

  useEffect(() => {
    if (!user?.id) return;

    const handleExistingBooking = async () => {
      setExistingBooking((existingBooking) => ({
        ...existingBooking,
        loading: true,
        error: "",
      }));

      try {
        const result = await axios.get(
          `${HOST}/api/bookings/me?service=existingBooking`,
          {
            withCredentials: true,
          },
        );

        setExistingBooking((existingBooking) => ({
          ...existingBooking,
          loading: false,
          booking: result.data.booking,
        }));
      } catch (error) {
        console.error(errorHandler(error).message);

        setExistingBooking((existingBooking) => ({
          ...existingBooking,
          loading: false,
          error: "Something went wrong. Please try again later",
        }));
      }
    };

    handleExistingBooking();
  }, [user?.id]);

  if (existingBooking.loading) {
    return (
      <div className="flex justify-center mt-[2.5rem]">
        <Skeleton variant="rounded" className="w-[80%]" height={48} />
      </div>
    );
  }

  return (
    <div className="mt-[2.5rem] flex justify-center">
      {user?.role !== "agent" && existingBooking.booking ? (
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
