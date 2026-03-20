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
  const fullName = `${agent.first_name} ${agent.last_name}`.trim();

  return (
    <div className="px-[1rem] py-[1.5rem] md:px-[2rem] md:py-[2rem] lg:px-[3rem] lg:py-[2.5rem] xl:max-w-6xl xl:mx-auto xl:w-full">
      <AgentViewHeader />

      {/* Info Card */}
      <div className="bg-white rounded-xl border-2 border-secondary-normal/30 p-5 space-y-4 relative md:p-7 lg:p-9">
        <AgentRemove agentId={agentId} />

        <div className="md:grid md:grid-cols-[minmax(0,260px)_1fr] md:gap-8 lg:gap-10">
          <div className="md:border-r md:border-secondary-normal/15 md:pr-6 lg:pr-8">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
              {agent.avatar_url ? (
                <div className="relative w-[6rem] h-[6rem] rounded-full overflow-hidden border-3 border-gray-300 md:w-[7rem] md:h-[7rem]">
                  <Image
                    src={agent.avatar_url}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-[6rem] h-[6rem] rounded-full border-3 border-gray-300 md:w-[7rem] md:h-[7rem]">
                  <IoMdPerson className="text-gray-400 text-4xl md:text-5xl" />
                </div>
              )}
            </div>

            <div className="mt-4 md:mt-6 text-center overflow-hidden md:text-left">
              <p className="text-lg font-bold text-secondary-normal">
                {fullName}
              </p>
              <p className="text-xs text-secondary-normal/70 mt-1 md:mt-2">
                Assigned Agent
              </p>
            </div>

            <div className="mt-4 md:mt-6 hidden md:flex flex-wrap gap-2">
              <span className="text-[0.68rem] font-semibold px-2 py-1 rounded-full bg-secondary-normal/10 text-secondary-normal">
                Profile
              </span>
              <span className="text-[0.68rem] font-semibold px-2 py-1 rounded-full bg-primary-normal/10 text-primary-normal">
                Active
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-5 md:mt-0 md:space-y-6">
            <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:gap-6">
              <ProfileField label="First Name" value={agent.first_name} />
              <ProfileField label="Last Name" value={agent.last_name} />
            </div>
            <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:gap-6">
              <ProfileField label="Email" value={agent.email} />
              <ProfileField label="Nationality" value={agent.nationality} />
            </div>
          </div>
        </div>
      </div>

      {/* Agent's Booking */}
      <AgentBookings agentId={agentId} />
    </div>
  );
}
