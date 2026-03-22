import fetchWithAuth from "@/app/shared/lib/fetchWithAuth";
import { notFound } from "next/navigation";
import AgentsItem from "./AgentsItem";

export interface IAgent {
  avatar_url: string;
  email: string;
  id: string;
  name: string;
  userId: string;
}
export default async function AgentsList() {
  const result = await fetchWithAuth("api/agents/", {
    cache: "no-cache",
    method: "GET",
  });

  if (!result.ok) {
    return notFound();
  }

  const parsedResult: { message: string; agents: IAgent[] } =
    await result.json();

  const agents = parsedResult.agents;

  return (
    <div className="flex-1 overflow-y-auto">
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
