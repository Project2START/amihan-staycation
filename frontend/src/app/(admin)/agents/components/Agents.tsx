import AgentsList from "./AgentsList";
import AgentsAddNew from "./AgentsAddNew";
import { Suspense } from "react";
import { Skeleton } from "@mui/material";

export default function Agents() {
  return (
    <div className="text-secondary-normal p-5 h-full flex flex-col">
      <Suspense
        fallback={
          <div className="grid gap-y-5">
            <Skeleton variant="rounded" height={70} />
            <Skeleton variant="rounded" height={70} />
            <Skeleton variant="rounded" height={70} />
            <Skeleton variant="rounded" height={70} />
            <Skeleton variant="rounded" height={70} />
          </div>
        }
      >
        <AgentsList />
      </Suspense>
      <AgentsAddNew />
    </div>
  );
}
