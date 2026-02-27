import { Status } from "../lib/getStatusInfo";
import { I_GET_ADMIN_BOOKINGS } from "../lib/myBookings-queries";
import MyBookingItem from "./MyBookingItem";

export default function MyBookingsList({
  data,
  filterStatus,
}: {
  data: I_GET_ADMIN_BOOKINGS;
  filterStatus?: Status;
}) {
  const allBookings = data?.bookingsByAdmin ?? [];
  const bookings = filterStatus
    ? allBookings.filter((b) => (b?.status ?? "pending") === filterStatus)
    : allBookings;

  const statusMessages: Record<Status, string> = {
    pending:
      "No pending reservations right now — the staycation calendar is clear.",
    confirmed:
      "No confirmed guests at the moment — rooms are ready for arrivals.",
    checked_in: "No guests are currently checked in — the property is quiet.",
    checked_out: "No recent check-outs — there are no departures to process.",
    action_required: "No bookings need attention — everything is up to date.",
    expired: "No expired reservations — all bookings are current.",
    cancelled: "No cancellations recorded — stays are proceeding as planned.",
  };

  return (
    <div className="h-full">
      <div className="h-full flex flex-col gap-y-5">
        {bookings.length === 0 ? (
          <div className="flex justify-center mb-[1rem] items-center font-bold text-center text-gray-300 py-8 h-full">
            <span>
              {filterStatus
                ? statusMessages[filterStatus]
                : "No bookings available."}
            </span>
          </div>
        ) : (
          bookings.filter(Boolean).map((b) => {
            const check_in = b?.check_period?.check_in ?? "";
            const check_out = b?.check_period?.check_out ?? "";
            const contact_number = b?.contact_number ?? "";
            const name = b?.name ?? "Unknown";
            const product_name = b?.product?.name ?? "—";
            const status = (b?.status ?? "pending") as any;
            const id = b?.id ?? `${name}-${check_in}`;

            return (
              <MyBookingItem
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
    </div>
  );
}
