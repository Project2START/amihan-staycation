"use client";

import dayjs from "dayjs";
import Link from "next/link";
import {
  getStatusColor,
  getStatusDisplayName,
  Status,
} from "@/app/(admin)/my-bookings/lib/getStatusInfo";

interface IMyBookingsHistoryItem {
  name: string;
  contact_number: string;
  check_in: string;
  check_out: string;
  status: string;
  product_name: string;
  id: string;
}

export default function MyBookingsHistoryItem({
  name,
  contact_number,
  check_in,
  check_out,
  status,
  product_name,
  id,
}: IMyBookingsHistoryItem) {
  const colorStatus = getStatusColor(status as Status);
  const displayNameStatus = getStatusDisplayName(status as Status);

  return (
    <Link
      href={`/units/booking/${id}`}
      className="hover-animation lg:hover:bg-primary-normal/10"
    >
      <div
        className="relative text-xs text-secondary-normal rounded-lg p-3 border-l-2 border-r-2 border-b-2 border-gray-300 lg:p-6"
        style={{ borderTop: `3.5px solid ${colorStatus}` }}
      >
        <div
          className="absolute top-0 right-0 rounded-bl-4xl p-[0.35rem] pl-[1rem] text-white"
          style={{ backgroundColor: colorStatus }}
        >
          <span className="capitalize font-bold lg:text-base">
            {displayNameStatus}
          </span>
        </div>
        <div>
          <span className="text-base font-bold lg:text-lg">{name}</span>
        </div>
        <div className="flex items-center justify-between mt-[0.25rem] lg:text-base">
          <div>
            <span>{contact_number}</span>
          </div>
          <div>
            <span className="font-bold">{product_name}</span>
            <span className="mx-[0.5rem]">/</span>
            <span>{dayjs(check_in).format("MMMM DD")}</span>
            <span className="mx-[0.25rem]">-</span>
            <span>{dayjs(check_out).format("DD")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
