"use client";

import { useCallback, useEffect, useState } from "react";
import fetchWithAuthClient from "@/app/shared/lib/fetchWithAuthClient";
import AgentsItem from "./AgentsItem";
import { Skeleton } from "@mui/material";
import ErrorClient from "@/app/shared/components/ErrorClient";
import { useRouter } from "next/navigation";

export interface IAgent {
  avatar_url: string;
  createdAt?: string;
  email: string;
  id: string;
  name: string;
  userId: string;
}

export default function AgentsList() {
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();

  const fetchAgents = useCallback(async () => {
    try {
      const result = await fetchWithAuthClient("api/agents/", {
        cache: "no-cache",
        method: "GET",
      });

      if (!result.ok) {
        setError(true);
        return;
      }

      const parsedResult: { message: string; agents: IAgent[] } =
        await result.json();

      const sortedAgents = [...(parsedResult.agents ?? [])].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return timeB - timeA;
      });

      setAgents(sortedAgents);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  useEffect(() => {
    const handleAgentsUpdated = () => {
      fetchAgents();
    };

    window.addEventListener("agents:updated", handleAgentsUpdated);

    return () => {
      window.removeEventListener("agents:updated", handleAgentsUpdated);
    };
  }, [fetchAgents]);

  if (loading) {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="grid gap-y-5 md:h-full md:grid-rows-[auto_1fr]">
          <div className="rounded-xl border border-secondary-normal/15 bg-white/90 p-4 md:p-5">
            <div className="grid gap-3 md:grid-cols-3">
              <Skeleton variant="rounded" height={26} />
              <Skeleton variant="rounded" height={26} />
              <Skeleton variant="rounded" height={26} />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Skeleton variant="rounded" height={118} />
            <Skeleton variant="rounded" height={118} />
            <Skeleton variant="rounded" height={118} />
            <Skeleton variant="rounded" height={118} />
            <Skeleton variant="rounded" height={118} />
            <Skeleton variant="rounded" height={118} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorClient onRetry={() => router.refresh()} />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {agents.length !== 0 && (
        <section className="rounded-xl border border-secondary-normal/15 bg-white/90 p-3 md:p-4 lg:p-5">
          <div className="flex items-center justify-between gap-x-3 pb-3 border-b border-secondary-normal/10">
            <h2 className="text-sm md:text-base font-bold text-secondary-normal">
              Team Agents
            </h2>
            <span className="text-[0.7rem] md:text-xs font-semibold px-2 py-1 rounded-full bg-secondary-normal/10 text-secondary-normal">
              {agents.length} total
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 md:gap-4">
            {agents.map((agent) => {
              return <AgentsItem key={agent.id} agent={agent} />;
            })}
          </div>
        </section>
      )}

      {agents.length === 0 && (
        <div className="h-full min-h-[16rem] flex justify-center items-center text-base text-center opacity-30 px-4">
          <p>
            Ready to grow your team? 💼 Click{" "}
            <strong>
              <i>+ Add New Agent</i>
            </strong>{" "}
            below to add your first agent.
          </p>
        </div>
      )}
    </div>
  );
}
