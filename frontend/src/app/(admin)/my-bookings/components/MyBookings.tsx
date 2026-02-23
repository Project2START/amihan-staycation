"use client";

import { useQuery } from "@apollo/client/react";
import Skeleton from "@mui/material/Skeleton";
import { FiRefreshCw } from "react-icons/fi";
import {
  GET_ADMIN_BOOKINGS,
  I_GET_ADMIN_BOOKINGS,
} from "../lib/myBookings-queries";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import ErrorClient from "@/app/shared/components/ErrorClient";
import MyBookingsList from "./MyBookingsList";

export default function MyBookings() {
  const { loading, error, data, refetch } =
    useQuery<I_GET_ADMIN_BOOKINGS>(GET_ADMIN_BOOKINGS);

  if (loading)
    return (
      <div className="grid gap-y-5">
        <Skeleton variant="rounded" height={70} />
        <Skeleton variant="rounded" height={70} />
        <Skeleton variant="rounded" height={70} />
        <Skeleton variant="rounded" height={70} />
      </div>
    );

  if (error || !data)
    return (
      <ErrorClient
        message={errorHandler(error).message}
        onRetry={() => {
          void refetch?.();
        }}
      />
    );

  if (data?.bookingsByAdmin && data.bookingsByAdmin.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-center font-bold text-lg text-gray-300">
          You currently have no bookings.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-4">
        <button
          type="button"
          onClick={() => refetch()}
          className="text-secondary-normal text-xs flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 font-bold text-gray-700 hover:bg-gray-100 transition"
        >
          <span className="text-xs mr-2">
            <FiRefreshCw />
          </span>
          <span className="text-xs">Refresh</span>
        </button>
      </div>
      <div>
        <MyBookingsList data={data} />
      </div>
    </div>
  );
}
