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
import { useState } from "react";
import { Status } from "../lib/getStatusInfo";

const statuses: { name: string; status: Status }[] = [
  { name: "Pending", status: "pending" },
  { name: "Confirmed", status: "confirmed" },
  { name: "Checked-In", status: "checked_in" },
  { name: "Checked-Out", status: "checked_out" },
  { name: "Action Required", status: "action_required" },
  { name: "Cancelled", status: "cancelled" },
  { name: "Expired", status: "expired" },
];

export default function MyBookings() {
  const [filterStatus, setFilterStatus] = useState<Status>("pending");

  const handleFilterStatus = (status: Status) => {
    setFilterStatus(status);
  };

  const { loading, error, data, refetch } = useQuery<I_GET_ADMIN_BOOKINGS>(
    GET_ADMIN_BOOKINGS,
    { fetchPolicy: "network-only" },
  );

  if (loading)
    return (
      <div className="mt-[1.5rem] grid gap-y-5 lg:mt-0">
        <div className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-3">
            <Skeleton variant="rounded" width={110} height={34} />
            <Skeleton variant="rounded" width={120} height={34} />
            <Skeleton variant="rounded" width={125} height={34} />
            <Skeleton variant="rounded" width={150} height={34} />
          </div>
          <Skeleton variant="rounded" width={112} height={34} />
        </div>

        <div className="grid gap-y-5">
          <Skeleton variant="rounded" height={84} />
          <Skeleton variant="rounded" height={84} />
          <Skeleton variant="rounded" height={84} />
          <Skeleton variant="rounded" height={84} />
        </div>

        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
          <Skeleton variant="rounded" height={90} />
          <Skeleton variant="rounded" height={90} />
          <Skeleton variant="rounded" height={90} />
        </div>
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

  const counts: Partial<Record<Status, number>> = {};
  (data?.bookingsByAdmin ?? []).forEach((b) => {
    const st = (b?.status ?? "pending") as Status;
    counts[st] = (counts[st] ?? 0) + 1;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div>
          <ul className="mb-3 flex items-center justify-between gap-x-3 overflow-x-auto py-2 text-sm lg:mb-4 lg:flex-wrap lg:justify-start lg:gap-2.5 lg:overflow-visible">
            {statuses.map((status) => {
              const statusCount = counts[status.status] ?? 0;

              return (
                <li key={status.status}>
                  <button
                    onClick={() => handleFilterStatus(status.status)}
                    className="text-nowrap flex items-center gap-x-1 rounded-lg border-2 border-secondary-normal/30 px-3 py-1 lg:rounded-full lg:px-3.5 lg:py-1.5 lg:text-[0.82rem]"
                    style={
                      status.status === filterStatus
                        ? {
                            backgroundColor: "var(--color-secondary-normal)",
                            color: "white",
                          }
                        : undefined
                    }
                  >
                    <span>{status.name}</span>
                    {statusCount === 0 ? null : (
                      <div className="px-[0.5rem] min-w-[1.25rem] max-w-[2.5rem] rounded-full bg-primary-normal">
                        <span className="text-white font-bold text-[0.65rem] text-center">
                          {statusCount > 99 ? "99+" : statusCount}
                        </span>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mb-4 flex items-center justify-end lg:mb-5">
          <button
            type="button"
            onClick={() => refetch()}
            className="text-secondary-normal flex items-center rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-bold text-gray-700 transition hover:bg-gray-100 lg:px-3 lg:py-1.5"
          >
            <span className="text-xs mr-2">
              <FiRefreshCw />
            </span>
            <span className="text-xs">Refresh</span>
          </button>
        </div>
      </div>

      <div className="flex-1 ">
        <MyBookingsList data={data} filterStatus={filterStatus} />
      </div>
    </div>
  );
}
