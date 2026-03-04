import { IUserBooking } from "../page";
import MyBookingsHistoryItem from "./MyBookingsHistoryItem";

export default function MyBookingsHistoryList({
  bookings,
}: {
  bookings: IUserBooking[];
}) {
  if (bookings.length === 0) {
    return (
      <div className="flex justify-center items-center font-bold text-center text-gray-300 py-8 h-[50vh]">
        <span>You have no bookings yet.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-y-auto flex-col gap-y-5">
      {bookings.map((b) => {
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
      })}
    </div>
  );
}
