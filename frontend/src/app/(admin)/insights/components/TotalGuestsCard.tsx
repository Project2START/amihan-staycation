import { HiOutlineUsers } from "react-icons/hi";

interface TotalGuestsCardProps {
  totalGuestsHosted: number;
}

export default function TotalGuestsCard({
  totalGuestsHosted,
}: TotalGuestsCardProps) {
  return (
    <div
      style={{ backgroundColor: "#4A6B6B" }}
      className="text-white rounded-xl p-8 shadow-lg mb-8"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="p-2 sm:p-3 bg-white/20 rounded-lg">
          <HiOutlineUsers className="text-2xl sm:text-3xl md:text-3xl" />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-semibold">Total Guests Hosted</h3>
        <p className="text-xl sm:text-3xl md:text-4xl font-bold">{totalGuestsHosted}</p>
      </div>
    </div>
  );
}
