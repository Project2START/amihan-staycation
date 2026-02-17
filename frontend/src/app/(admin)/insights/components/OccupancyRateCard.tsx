import { MdAttachMoney } from "react-icons/md";

interface OccupancyRateCardProps {
  occupancyRate: number;
}

export default function OccupancyRateCard({
  occupancyRate,
}: OccupancyRateCardProps) {
  return (
    <div
      style={{ backgroundColor: "#6B63AC" }}
      className="text-white rounded-xl p-6 md:p-8 shadow-lg"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
          <MdAttachMoney className="text-2xl sm:text-3xl md:text-3xl" />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold">Occupancy Rate</h3>
        <p className="text-xl sm:text-3xl md:text-4xl font-bold">{occupancyRate}%</p>
      </div>
    </div>
  );
}
