import { LuCircleDollarSign } from "react-icons/lu";
import { formatMoney } from "@/app/shared/lib/formatMoney";

interface TotalRevenueCardProps {
  totalRevenue: number;
}

export default function TotalRevenueCard({
  totalRevenue,
}: TotalRevenueCardProps) {
  return (
    <div className="bg-secondary-normal text-white rounded-xl p-4 shadow-lg text-center break-words">
      <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#8AD34E] text-secondary-normal">
        <LuCircleDollarSign className="text-[1rem]" />
      </div>
      <p className="font-bold text-[1rem] sm:text-[1.1rem]">Total Revenue</p>
      <h3 className="font-bold text-[2rem] leading-tight mt-1">
        {formatMoney(totalRevenue, { symbol: "₱", decimals: 2 })}
      </h3>
    </div>
  );
}
