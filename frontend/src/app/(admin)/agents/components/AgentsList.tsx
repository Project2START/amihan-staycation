import fetchWithAuth from "@/app/shared/lib/fetchWithAuth";
import { notFound } from "next/navigation";
import AgentsItem from "./AgentsItem";
import AgentsAddNew from "./AgentsAddNew";

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

  return (
    <div className="flex-1 flex flex-col gap-y-3 overflow-y-auto">
      {parsedResult.agents.map((agent) => {
        return <AgentsItem key={agent.id} agent={agent} />;
      })}

      {parsedResult.agents.length === 0 && (
        <div className="h-full flex justify-center items-center text-base text-center opacity-30">
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
