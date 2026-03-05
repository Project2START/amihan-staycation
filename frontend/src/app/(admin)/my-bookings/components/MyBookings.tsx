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
  { name: "Action Required", status: "action_required" },
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
      <div className="grid gap-y-5 mt-[1.5rem]">
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

  const counts: Partial<Record<Status, number>> = {};
  (data?.bookingsByAdmin ?? []).forEach((b) => {
    const st = ((b as any)?.status ?? "pending") as Status;
    counts[st] = (counts[st] ?? 0) + 1;
  });

  return (
    <div className="h-full flex flex-col">
      <div>
        <ul className="flex justify-between items-center gap-x-3 text-sm overflow-x-auto py-2 mb-3">
          {statuses.map((status) => {
            const statusCount = counts[status.status] ?? 0;

            return (
              <li key={status.status}>
                <button
                  onClick={() => handleFilterStatus(status.status)}
                  className="text-nowrap flex items-center px-3 py-1 rounded-lg border-2 border-secondary-normal/30 gap-x-1"
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
      <div className="flex items-center justify-end mb-4">
        <button
          type="button"
          onClick={() => refetch()}
          className="text-secondary-normal text-xs flex items-center bg-white border border-gray-300 rounded-lg px-2 py-1 font-bold text-gray-700 hover:bg-gray-100 transition"
        >
          <span className="text-xs mr-2">
            <FiRefreshCw />
          </span>
          <span className="text-xs">Refresh</span>
        </button>
      </div>
      <div className="flex-1">
        <MyBookingsList data={data} filterStatus={filterStatus} />
      </div>
    </div>
  );
}
