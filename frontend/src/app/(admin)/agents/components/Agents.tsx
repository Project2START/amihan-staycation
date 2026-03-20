import AgentsList from "./AgentsList";
import AgentsAddNew from "./AgentsAddNew";
import { Suspense } from "react";
import { Skeleton } from "@mui/material";

export default function Agents() {
  return (
    <div className="text-secondary-normal p-5 h-full flex flex-col md:max-w-6xl md:mx-auto md:w-full md:px-6 lg:px-10">
      <Suspense
        fallback={
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
        }
      >
        <AgentsList />
      </Suspense>
      <div className="mt-[0.5rem] md:mt-4">
        <AgentsAddNew />
      </div>
    </div>
  );
}
