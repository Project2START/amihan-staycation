import { LuUsers } from "react-icons/lu";

interface GuestsHostedCardProps {
  totalGuestsHosted: number;
}

export default function GuestsHostedCard({
  totalGuestsHosted,
}: GuestsHostedCardProps) {
  return (
    <div className="rounded-xl p-4 shadow-lg text-white text-center bg-[#617A7D] break-words">
      <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
        <LuUsers className="text-[1rem]" />
      </div>
      <p className="font-bold text-[0.95rem] sm:text-[1.05rem]">
        Total Guests Hosted
      </p>
      <h3 className="font-bold text-[2rem] mt-1">{totalGuestsHosted}</h3>
    </div>
  );
}
