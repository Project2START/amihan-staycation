import React, { Suspense } from "react";
import HistoryLoading from "./loading";

export default async function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col">
      <Suspense fallback={<HistoryLoading />}>{children}</Suspense>
    </div>
  );
}
