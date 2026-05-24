"use client";

import { HOST } from "@/app/shared/constants/config";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import { useAppSelector } from "@/lib/hooks";
import { Skeleton } from "@mui/material";
import axiosWithAuth from "@/app/shared/lib/axiosWithAuth";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const bookingHref = `/bookings?id=${productId}`;
  const signInRedirectHref = `/sign-in?redirect=${encodeURIComponent(bookingHref)}`;

  useEffect(() => {
    if (!user?.id) return;

    const handleExistingBooking = async () => {
      setExistingBooking((existingBooking) => ({
        ...existingBooking,
        loading: true,
        error: "",
      }));

      try {
        const result = await axiosWithAuth.get(
          `${HOST}/api/bookings/me?service=existingBooking`,
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
      <div className="mt-[2.5rem] flex justify-center md:mt-[1.5rem]">
        <Skeleton variant="rounded" className="w-[80%] md:w-full" height={48} />
      </div>
    );
  }

  return (
    <div className="mt-[2.5rem] flex justify-center md:mt-[1.5rem]">
      {user?.role !== "agent" && existingBooking.booking ? (
        <p className="text-reject-normal px-1 text-center text-xs md:text-sm">
          You’ve already got a booking in place, so another reservation isn’t
          available at the moment.
        </p>
      ) : (
        <Link
          href={user ? bookingHref : signInRedirectHref}
          className="w-[80%] rounded-lg bg-primary-normal py-[1rem] text-center text-xs font-bold text-white md:w-full md:py-[1.05rem] md:text-sm hover-animation lg:hover:bg-primary-normal/80"
        >
          Book Now
        </Link>
      )}
    </div>
  );
}
