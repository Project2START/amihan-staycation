import dayjs from "dayjs";
import Link from "next/link";
import {
  getStatusColor,
  getStatusDisplayName,
  Status,
} from "@/app/(admin)/my-bookings/lib/getStatusInfo";
import { formatMoney } from "@/app/shared/lib/formatMoney";
import { BookingRow } from "../lib/insights.types";

export default function InsightsBookingItem({
  booking,
}: {
  booking: BookingRow;
}) {
  const statusColor = getStatusColor(booking.status as Status);
  const statusDisplayName = getStatusDisplayName(booking.status as Status);
  const checkIn = booking.check_period?.check_in;
  const checkOut = booking.check_period?.check_out;
  const unitName = booking.product?.name ?? "Unknown Unit";
  const price = booking.product?.price ?? 0;
  const guests = booking.guest_count ?? 1;

  return (
    <Link href={`/my-bookings/${booking.id}`}>
      <div
        className="relative text-xs text-secondary-normal rounded-lg p-3 border-l-2 border-r-2 border-b-2 border-gray-300"
        style={{ borderTop: `3.5px solid ${statusColor}` }}
      >
        <div
          className="absolute top-0 right-0 rounded-bl-4xl p-[0.35rem] pl-[1rem] text-white"
          style={{ backgroundColor: statusColor }}
        >
          <span className="capitalize font-bold">{statusDisplayName}</span>
        </div>

        <div>
          <span className="text-base font-bold">{unitName}</span>
        </div>

        <div className="flex items-center justify-between mt-[0.25rem]">
          <div className="flex items-center gap-x-2">
            <span>
              {guests} {guests === 1 ? "guest" : "guests"}
            </span>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-secondary-normal">
              {formatMoney(price)}
            </span>
          </div>
          {checkIn && checkOut && (
            <div>
              <span>{dayjs(checkIn).format("MMM DD")}</span>
              <span className="mx-1">-</span>
              <span>{dayjs(checkOut).format("MMM DD, YYYY")}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
