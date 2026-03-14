"use client";

import { useState } from "react";
import {
  getStatusColor,
  Status,
} from "@/app/(admin)/my-bookings/lib/getStatusInfo";
import { BookingRow } from "../lib/insights.types";
import { ALL_BOOKING_STATUSES } from "../lib/insights.utils";
import InsightsBookingItem from "./InsightsBookingItem";

const TAB_LIST = [{ name: "All", status: "all" }, ...ALL_BOOKING_STATUSES];

export default function InsightsBookingsSection({
  bookings,
}: {
  bookings: BookingRow[];
}) {
  const [activeStatus, setActiveStatus] = useState<string>("all");

  const counts: Record<string, number> = {};
  bookings.forEach((b) => {
    const st = b.status ?? "pending";
    counts[st] = (counts[st] ?? 0) + 1;
  });

  const filtered =
    activeStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeStatus);

  return (
    <div className="mt-4 rounded-xl border border-secondary-normal/20 p-3">
      <h2 className="font-bold text-secondary-normal text-[1rem] mb-3">
        Bookings in Period
      </h2>

      <ul className="flex items-center gap-x-2 text-sm overflow-x-auto py-1 mb-3">
        {TAB_LIST.map((tab) => {
          const count =
            tab.status === "all" ? bookings.length : (counts[tab.status] ?? 0);
          const isActive = activeStatus === tab.status;
          const dotColor =
            tab.status !== "all"
              ? getStatusColor(tab.status as Status)
              : undefined;

          return (
            <li key={tab.status} className="flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveStatus(tab.status)}
                className="text-nowrap flex items-center gap-x-1 px-3 py-1 rounded-lg border-2 border-secondary-normal/30"
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--color-secondary-normal)",
                        color: "white",
                      }
                    : undefined
                }
              >
                {dotColor && !isActive && (
                  <span
                    className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: dotColor }}
                  />
                )}
                <span>{tab.name}</span>
                {count > 0 && (
                  <div className="px-[0.4rem] min-w-[1.2rem] rounded-full bg-primary-normal">
                    <span className="text-white font-bold text-[0.65rem]">
                      {count > 99 ? "99+" : count}
                    </span>
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 ? (
        <div className="flex justify-center items-center font-bold text-gray-300 h-[18rem] md:h-[22rem]">
          <span>No bookings for this status in the selected period.</span>
        </div>
      ) : (
        <div className="h-[18rem] md:h-[22rem] overflow-y-auto pr-1">
          <div className="flex flex-col gap-y-3 pb-2">
            {filtered.map((booking) => (
              <InsightsBookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
