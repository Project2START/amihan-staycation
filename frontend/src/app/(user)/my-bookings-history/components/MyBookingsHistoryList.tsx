"use client";

import { useState } from "react";
import { Status } from "@/app/(admin)/my-bookings/lib/getStatusInfo";
import { IUserBooking } from "../page";
import MyBookingsHistoryItem from "./MyBookingsHistoryItem";

const statuses: { name: string; status: Status }[] = [
  { name: "Pending", status: "pending" },
  { name: "Confirmed", status: "confirmed" },
  { name: "Checked-In", status: "checked_in" },
  { name: "Checked-Out", status: "checked_out" },
  { name: "Action Required", status: "action_required" },
  { name: "Cancelled", status: "cancelled" },
  { name: "Expired", status: "expired" },
];

export default function MyBookingsHistoryList({
  bookings,
}: {
  bookings: IUserBooking[];
}) {
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  const counts: Partial<Record<Status, number>> = {};
  bookings.forEach((b) => {
    const st = (b.status ?? "pending") as Status;
    counts[st] = (counts[st] ?? 0) + 1;
  });

  if (bookings.length === 0) {
    return (
      <div className="flex justify-center items-center font-bold text-center text-gray-300 py-8 h-[50vh]">
        <span>You have no bookings yet.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-y-auto flex-col gap-y-5">
      <ul className="flex justify-between items-center gap-x-3 text-sm overflow-x-auto py-2 mb-3">
        <li>
          <button
            onClick={() => setFilterStatus("all")}
            className="text-nowrap flex items-center px-3 py-1 rounded-lg border-2 border-secondary-normal/30 gap-x-1"
            style={
              filterStatus === "all"
                ? {
                    backgroundColor: "var(--color-secondary-normal)",
                    color: "white",
                  }
                : undefined
            }
          >
            <span>All</span>
          </button>
        </li>
        {statuses.map((s) => {
          const statusCount = counts[s.status] ?? 0;

          return (
            <li key={s.status}>
              <button
                onClick={() => setFilterStatus(s.status)}
                className="text-nowrap flex items-center px-3 py-1 rounded-lg border-2 border-secondary-normal/30 gap-x-1"
                style={
                  s.status === filterStatus
                    ? {
                        backgroundColor: "var(--color-secondary-normal)",
                        color: "white",
                      }
                    : undefined
                }
              >
                <span>{s.name}</span>
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

      {filteredBookings.length === 0 ? (
        <div className="flex justify-center items-center font-bold text-center text-gray-300 py-8 h-[50vh]">
          <span>No bookings found for this status.</span>
        </div>
      ) : (
        filteredBookings.map((b) => {
          const check_in = b.check_period?.check_in ?? "";
          const check_out = b.check_period?.check_out ?? "";
          const contact_number = b.contact_number ?? "";
          const name = b.name ?? "Unknown";
          const product_name = b.product?.name ?? "—";
          const status = b.status ?? "pending";
          const id = b.id;

          return (
            <MyBookingsHistoryItem
              key={id}
              check_in={check_in}
              check_out={check_out}
              contact_number={contact_number}
              name={name}
              product_name={product_name}
              status={status}
              id={id}
            />
          );
        })
      )}
    </div>
  );
}
