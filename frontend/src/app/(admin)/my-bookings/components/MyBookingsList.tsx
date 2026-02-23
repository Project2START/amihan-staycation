import { I_GET_ADMIN_BOOKINGS } from "../lib/myBookings-queries";
import MyBookingItem from "./MyBookingItem";

export default function MyBookingsList({
  data,
}: {
  data: I_GET_ADMIN_BOOKINGS;
}) {
  const bookings = data?.bookingsByAdmin ?? [];

  return (
    <div>
      <div className="flex flex-col gap-y-5">
        {bookings.filter(Boolean).map((b) => {
          const check_in = b?.check_period?.check_in ?? "";
          const check_out = b?.check_period?.check_out ?? "";
          const contact_number = b?.contact_number ?? "";
          const name = b?.name ?? "Unknown";
          const product_name = b?.product?.name ?? "—";
          const status = (b?.status ?? "pending") as any;
          const key = (b as any)?.id ?? `${name}-${check_in}`;

          return (
            <MyBookingItem
              key={key}
              check_in={check_in}
              check_out={check_out}
              contact_number={contact_number}
              name={name}
              product_name={product_name}
              status={status}
            />
          );
        })}
      </div>
    </div>
  );
}
