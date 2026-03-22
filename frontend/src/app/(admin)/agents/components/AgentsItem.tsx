import Image from "next/image";
import { IAgent } from "./AgentsList";
import { IoMdPerson } from "react-icons/io";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

export default function AgentsItem({ agent }: { agent: IAgent }) {
  return (
    <Link
      href={`/agents/${agent.id}`}
      className="border border-secondary-normal/25 rounded-xl p-3 flex gap-x-3 items-center bg-white transition-all duration-200 hover:border-secondary-normal/50 hover:shadow-md active:scale-[0.995] md:p-4 md:items-start"
    >
      <div className="flex-shrink-0">
        {agent.avatar_url ? (
          <div className="relative w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden border-2 border-gray-300 md:w-[3rem] md:h-[3rem]">
            <Image
              src={agent.avatar_url}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full border-2 border-gray-300 md:w-[3rem] md:h-[3rem]">
            <IoMdPerson className="text-gray-400 text-4xl md:text-[2.6rem]" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-x-2">
          <div className="min-w-0">
            <span className="font-bold text-base md:text-[1.02rem] block truncate">
              {agent.name}
            </span>
            <span className="text-xs opacity-70 block truncate mt-[0.1rem]">
              {agent.email}
            </span>
          </div>
          <span className="hidden md:inline-flex text-[0.62rem] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-secondary-normal/10 text-secondary-normal">
            Agent
          </span>
        </div>

        <div className="hidden md:flex items-center justify-between mt-3 pt-3 border-t border-secondary-normal/10">
          <span className="text-[0.72rem] text-secondary-normal/70 font-medium">
            View details and bookings
          </span>
          <span className="inline-flex items-center gap-x-1 text-[0.72rem] font-semibold text-secondary-normal">
            Open
            <FiChevronRight className="text-sm" />
          </span>
        </div>
      </div>
    </Link>
  );
}
