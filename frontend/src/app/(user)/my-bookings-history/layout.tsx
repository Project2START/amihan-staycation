import { Suspense } from "react";
import { Skeleton } from "@mui/material";

export default function MyBookingsHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="h-[calc(100vh-72px)] flex flex-col px-[1rem] py-[1.5rem] md:px-[2rem] lg:px-[3rem]">
          {/* Header skeleton */}
          <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 pb-[1rem] mb-4">
            <span className="flex-1/3 flex items-center lg:hidden">
              <Skeleton variant="circular" width={36} height={36} />
            </span>
            <Skeleton
              variant="text"
              width={160}
              height={36}
              className="flex-1/3 mx-auto lg:flex-none"
            />
            <span className="flex-1/3 lg:hidden" />
          </div>
          {/* List skeletons: mobile */}
          <div className="flex flex-col flex-1 overflow-hidden md:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="mb-5" key={i}>
                <Skeleton variant="rounded" height={90} className="w-full" />
              </div>
            ))}
          </div>
          {/* List skeletons: laptop/desktop */}
          <div className="hidden md:flex md:flex-col md:flex-1 md:overflow-hidden md:w-[70%] md:self-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="mb-10" key={i}>
                <Skeleton variant="rounded" height={90} className="w-full" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
