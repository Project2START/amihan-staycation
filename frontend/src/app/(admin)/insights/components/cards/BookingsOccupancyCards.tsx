import { LuCalendarDays, LuDoorOpen } from "react-icons/lu";

interface BookingsOccupancyCardsProps {
  totalBookings: number;
  occupancyRate: number;
}

export default function BookingsOccupancyCards({
  totalBookings,
  occupancyRate,
}: BookingsOccupancyCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl p-4 shadow-lg text-white text-center bg-[#227E98] break-words">
        <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
          <LuCalendarDays className="text-[1rem]" />
        </div>
        <p className="font-bold text-[0.95rem]">Total Bookings</p>
        <h3 className="font-bold text-[1.5rem] mt-1">{totalBookings}</h3>
      </div>

      <div className="rounded-xl p-4 shadow-lg text-white text-center bg-[#587DBD] break-words">
        <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
          <LuDoorOpen className="text-[1rem]" />
        </div>
        <p className="font-bold text-[0.95rem]">Occupancy Rate</p>
        <h3 className="font-bold text-[1.5rem] mt-1">{occupancyRate}%</h3>
      </div>
    </div>
  );
}
