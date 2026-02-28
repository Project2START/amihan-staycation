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
          className="relative text-xs text-secondary-normal rounded-lg p-3 border-l-2 border-r-2 border-b-2 border-gray-300"
          style={{ borderTop: `3.5px solid ${colorStatus}` }}
        >
          <div
            className="absolute top-0 right-0 rounded-bl-4xl p-[0.35rem] pl-[1rem] text-white"
            style={{ backgroundColor: colorStatus }}
          >
            <span className="capitalize font-bold">{displayNameStatus}</span>
          </div>
          <div>
            <span className="text-base font-bold">{name}</span>
          </div>
          <div className="flex items-center justify-between mt-[0.25rem]">
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
    </div>
  );
}
