"use client";

import dayjs from "dayjs";
import {
  getStatusColor,
  getStatusDisplayName,
  Status,
} from "../lib/getStatusInfo";
import Link from "next/link";

interface IMyBookingItem {
  name: string;
  contact_number: string;
  check_in: string;
  check_out: string;
  status: Status;
  product_name: string;
  id: string;
}

export default function MyBookingItem({
  name,
  contact_number,
  check_in,
  check_out,
  status,
  product_name,
  id,
}: IMyBookingItem) {
  const colorStatus = getStatusColor(status);
  const displayNameStatus = getStatusDisplayName(status);

  return (
    <div>
      <Link href={`/my-bookings/${id}`}>
        <div
          className="relative rounded-lg border-l-2 border-r-2 border-b-2 border-gray-300 p-3 text-xs text-secondary-normal transition-shadow hover:shadow-sm lg:rounded-xl lg:border lg:border-secondary-normal/15 lg:p-4 lg:hover:shadow-md"
          style={{ borderTop: `3.5px solid ${colorStatus}` }}
        >
          <div
            className="absolute top-0 right-0 rounded-bl-4xl p-[0.35rem] pl-[1rem] text-white lg:rounded-bl-3xl lg:px-3 lg:py-1"
            style={{ backgroundColor: colorStatus }}
          >
            <span className="capitalize font-bold lg:text-[0.72rem]">
              {displayNameStatus}
            </span>
          </div>
          <div>
            <span className="text-base font-bold lg:text-lg">{name}</span>
          </div>
          <div className="mt-[0.25rem] flex items-center justify-between lg:mt-2.5 lg:items-end">
            <div className="min-w-0">
              <span>{contact_number}</span>
            </div>
            <div className="text-right lg:text-sm">
              <span className="font-bold lg:font-semibold">{product_name}</span>
              <span className="mx-[0.5rem]">/</span>
              <span>{dayjs(check_in).format("MMMM DD")}</span>
              <span className="mx-[0.25rem]">-</span>
              <span>{dayjs(check_out).format("DD")}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
