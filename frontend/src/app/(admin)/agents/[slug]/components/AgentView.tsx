"use client";

import { useEffect, useState } from "react";
import { ProfileField } from "@/app/shared/components/profile/ProfileView";
import fetchWithAuthClient from "@/app/shared/lib/fetchWithAuthClient";
import Image from "next/image";
import { IoMdPerson } from "react-icons/io";
import AgentViewHeader from "./AgentViewHeader";
import AgentRemove from "./AgentRemove";
import AgentBookings from "./AgentBookings";
import Skeleton from "@mui/material/Skeleton";
import NotFoundClient from "@/app/shared/components/NotFoundClient";

export interface IAgent {
  id: string;
  first_name: string;
  last_name: string;
  nationality: string;
  email: string;
  avatar_url: string;
}

export default function AgentView({ agentId }: { agentId: string }) {
  const [agent, setAgent] = useState<IAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchAgent = async () => {
      try {
        const result = await fetchWithAuthClient(`/api/agents/${agentId}`);

        if (!result.ok) {
          if (mounted) setError(true);
          return;
        }

        const parsed: { message: string; agent: IAgent } = await result.json();

        if (mounted) {
          setAgent(parsed.agent);
        }
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAgent();

    return () => {
      mounted = false;
    };
  }, [agentId]);

  if (loading) {
    return (
      <div className="px-[1rem] py-[1.5rem] md:px-[2rem] md:py-[2rem] lg:px-[3rem] lg:py-[2.5rem] xl:max-w-6xl xl:mx-auto xl:w-full">
        <div className="mb-6 mt-3 md:mb-8 md:mt-4 lg:mb-10 flex items-center justify-between">
          <Skeleton variant="text" width={70} height={30} />
          <Skeleton variant="text" width={140} height={34} />
          <Skeleton
            variant="text"
            width={70}
            height={30}
            sx={{ visibility: "hidden" }}
          />
        </div>

        <div className="bg-white rounded-xl border-2 border-secondary-normal/30 p-5 md:p-7 lg:p-9">
          <div className="md:grid md:grid-cols-[minmax(0,260px)_1fr] md:gap-8 lg:gap-10">
            <div className="flex flex-col items-center md:block md:border-r md:border-secondary-normal/15 md:pr-6 lg:pr-8">
              <Skeleton variant="circular" width={112} height={112} />
              <div className="mt-4 md:mt-6 grid gap-y-2 md:gap-y-3">
                <Skeleton variant="text" width={180} height={30} />
                <Skeleton variant="text" width={120} height={22} />
              </div>
              <div className="mt-4 hidden md:flex gap-2">
                <Skeleton variant="rounded" width={70} height={26} />
                <Skeleton variant="rounded" width={70} height={26} />
              </div>
            </div>

            <div className="mt-4 space-y-5 md:mt-0 md:space-y-6 grid gap-3 md:grid-cols-2 md:gap-5 lg:gap-6">
              <Skeleton variant="rounded" height={70} />
              <Skeleton variant="rounded" height={70} />
              <Skeleton variant="rounded" height={70} />
              <Skeleton variant="rounded" height={70} />
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-10 lg:mt-12 grid gap-y-4 md:gap-y-5">
          <Skeleton variant="text" width={180} height={26} />
          <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-5 md:grid-cols-6">
            <Skeleton variant="rounded" height={90} />
            <Skeleton variant="rounded" height={90} />
            <Skeleton variant="rounded" height={90} />
            <Skeleton variant="rounded" height={90} />
            <Skeleton variant="rounded" height={90} />
            <Skeleton variant="rounded" height={90} />
          </div>
          <Skeleton variant="rounded" height={42} />
          <div className="grid gap-y-3 md:h-[28rem]">
            <Skeleton variant="rounded" height={78} />
            <Skeleton variant="rounded" height={78} />
            <Skeleton variant="rounded" height={78} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return <NotFoundClient />;
  }

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
                    sizes="(min-width: 768px) 112px, 96px"
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
