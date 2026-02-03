import { MdAttachMoney } from "react-icons/md";

interface TotalRevenueCardProps {
  totalRevenue: number;
}

export default function TotalRevenueCard({ totalRevenue }: TotalRevenueCardProps) {
  return (
    <div
      style={{ backgroundColor: "#1B7A9C" }}
      className="text-white rounded-xl p-8 mb-6 shadow-lg"
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
          <MdAttachMoney className="text-2xl sm:text-3xl md:text-4xl" />
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-semibold">Total Revenue</h2>
        <p className="text-2xl sm:text-4xl md:text-5xl font-bold">
          ₱ {totalRevenue.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
}
