"use client";

import { useEffect, useState } from "react";
import fetchWithAuthClient from "@/app/shared/lib/fetchWithAuthClient";
import MyBookingsHistoryList from "./components/MyBookingsHistoryList";
import ClientBackButton from "./components/ClientBackButton";
import { Skeleton } from "@mui/material";
import NotFoundClient from "@/app/shared/components/NotFoundClient";

export interface IUserBooking {
  id: string;
  name: string;
  contact_number: string;
  check_period: {
    check_in: string;
    check_out: string;
  };
  status: string;
  product: {
    name: string;
  };
  createdAt: string;
}

export default function MyBookingsHistoryPage() {
  const [bookings, setBookings] = useState<IUserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchBookings = async () => {
      try {
        const result = await fetchWithAuthClient("api/bookings/user/all", {
          cache: "no-cache",
          method: "GET",
        });

        if (!result.ok) {
          if (mounted) setError(true);
          return;
        }

        const parsed: { message: string; bookings: IUserBooking[] } =
          await result.json();

        if (mounted) {
          setBookings(parsed.bookings ?? []);
        }
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-72px)] flex flex-col px-[1rem] py-[1.5rem] md:px-[2rem] lg:px-[3rem]">
        {/* Header skeleton */}
        <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 pb-[1rem] mb-4">
          <span className="flex-1/3 flex items-center lg:hidden">
            <Skeleton variant="circular" width={36} height={36} />
          </span>
          <Skeleton
            variant="text"
            width={160}
            height={36}
            className="flex-1/3 mx-auto lg:flex-none"
          />
          <span className="flex-1/3 lg:hidden" />
        </div>
        {/* List skeletons: mobile */}
        <div className="flex flex-col flex-1 overflow-hidden md:hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="mb-5" key={i}>
              <Skeleton variant="rounded" height={90} className="w-full" />
            </div>
          ))}
        </div>
        {/* List skeletons: laptop/desktop */}
        <div className="hidden md:flex md:flex-col md:flex-1 md:overflow-hidden md:w-[70%] md:self-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="mb-10" key={i}>
              <Skeleton variant="rounded" height={90} className="w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <NotFoundClient />;
  }

  return (
    <div className="h-[calc(100vh-72px)] flex flex-col px-[1rem] py-[1.5rem] md:px-[2rem] lg:px-[3rem]">
      <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 pb-[1rem] mb-4">
        <span className="flex-1/3 flex items-center lg:hidden">
          <ClientBackButton />
        </span>
        <h1 className="flex-1/3 text-nowrap text-center text-lg font-bold text-secondary-normal md:text-xl lg:text-2xl lg:py-[1rem]">
          My Bookings
        </h1>
        <span className="flex-1/3 lg:hidden" />
      </div>

      <MyBookingsHistoryList bookings={bookings} />
    </div>
  );
}
