// "use client";

// import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import { ProfileField } from "@/app/shared/components/profile/ProfileView";
import fetchWithAuth from "@/app/shared/lib/fetchWithAuth";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IoMdPerson } from "react-icons/io";
import AgentViewHeader from "./AgentViewHeader";
import AgentRemove from "./AgentRemove";
import AgentBookings from "./AgentBookings";

export interface IAgent {
  id: string;
  first_name: string;
  last_name: string;
  nationality: string;
  email: string;
  avatar_url: string;
}

export default async function AgentView({ agentId }: { agentId: string }) {
  const result = await fetchWithAuth(`/api/agents/${agentId}`);

  if (!result.ok) {
    return notFound();
  }

  const parsed: { message: string; agent: IAgent } = await result.json();

  const agent = parsed.agent;
  return (
    <div className="px-[1rem] py-[1.5rem] md:px-[2rem] lg:px-[3rem]">
      <AgentViewHeader />

      {/* Info Card */}
      <div className="bg-white rounded-xl border-2 border-secondary-normal/30 p-6 space-y-4 relative">
        <AgentRemove agentId={agentId} />
        {/* Avatar */}
        <div className="flex justify-center">
          {agent.avatar_url ? (
            <div className="relative w-[6rem] h-[6rem] rounded-full overflow-hidden border-3 border-gray-300">
              <Image
                src={agent.avatar_url}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-[6rem] h-[6rem] rounded-full border-3 border-gray-300">
              <IoMdPerson className="text-gray-400 text-4xl" />
            </div>
          )}
        </div>
        <ProfileField label="First Name" value={agent.first_name} />
        <ProfileField label="Last Name" value={agent.last_name} />
        <ProfileField label="Email" value={agent.email} />
        <ProfileField label="Nationality" value={agent.nationality} />
      </div>

      {/* Agent's Booking */}
      <AgentBookings agentId={agentId} />
    </div>
  );
}
