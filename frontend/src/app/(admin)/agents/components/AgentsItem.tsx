import Image from "next/image";
import { IAgent } from "./AgentsList";
import { IoMdPerson } from "react-icons/io";
import Link from "next/link";

export default function AgentsItem({ agent }: { agent: IAgent }) {
  return (
    <Link
      href={`/agents/${agent.id}`}
      className="border-1 border-secondary-normal/30 rounded-lg p-3 flex gap-x-3 items-center"
    >
      <div>
        {agent.avatar_url ? (
          <div className="relative w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden border-2 border-gray-300">
            <Image
              src={agent.avatar_url}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full border-2 border-gray-300">
            <IoMdPerson className="text-gray-400 text-4xl" />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-base">{agent.name}</span>
        <span className="text-xs opacity-70">{agent.email}</span>
      </div>
    </Link>
  );
}
