import { MdAttachMoney } from "react-icons/md";

interface TotalRevenueCardProps {
  totalRevenue: number;
}

export default function TotalRevenueCard({ totalRevenue }: TotalRevenueCardProps) {
  return (
    <div
      style={{ backgroundColor: "#0B5173" }}
      className="text-white rounded-xl p-6 md:p-8 shadow-lg"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
          <MdAttachMoney className="text-2xl sm:text-3xl md:text-3xl" />
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold">Total Revenue</h2>
        <p className="text-xl sm:text-3xl md:text-4xl font-bold whitespace-nowrap">
          <span className="text-lg sm:text-xl md:text-lg lg:text-xl mr-1">₱</span>
          {totalRevenue.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
}
