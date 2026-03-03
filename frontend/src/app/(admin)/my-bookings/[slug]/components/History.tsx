"use client";

import { Skeleton } from "@mui/material";
import { useBookingHistory } from "../lib/useBookingHistory";
import Link from "next/link";
import { GoHistory } from "react-icons/go";

export default function History({ bookingId }: { bookingId: string }) {
  const { data, isError, isLoading } = useBookingHistory(bookingId);

  if (isLoading) {
    return (
      <div className="mt-[0.5rem]">
        <Skeleton variant="rounded" height={60} />
      </div>
    );
  }

  if (isError) {
    return null;
  }

  if (data?.history?.length === 0) {
    return null;
  }

  return (
    <div className="my-[0.75rem] text-xs">
      <Link href={`/my-bookings/history/${bookingId}`}>
        <div className="flex justify-center gap-x-1 bg-primary-normal text-white rounded-lg p-[0.75rem] font-bold">
          <div className="flex items-center gap-x-2">
            <span className="text-base">
              <GoHistory />
            </span>
            <span>View history</span>
          </div>
        </div>
      </Link>
      <p className="text-[0.65rem] italic">
        You have previous activity for this booking. Click View History to see
        the details.
      </p>
    </div>
  );
}
