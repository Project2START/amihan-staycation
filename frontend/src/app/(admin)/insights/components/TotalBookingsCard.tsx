import { SlCalender } from "react-icons/sl";

interface TotalBookingsCardProps {
  totalBookings: number;
}

export default function TotalBookingsCard({
  totalBookings,
}: TotalBookingsCardProps) {
  return (
    <div
      style={{ backgroundColor: "#1B7A9C" }}
      className="text-white rounded-xl p-8 shadow-lg"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
          <SlCalender className="text-2xl sm:text-3xl md:text-3xl" />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold">Total Bookings</h3>
        <p className="text-xl sm:text-3xl md:text-4xl font-bold">{totalBookings}</p>
      </div>
    </div>
  );
}
