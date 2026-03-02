import React, { Suspense } from "react";
import HistoryLoading from "./loading";

export default async function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">
      <Suspense fallback={<HistoryLoading />}>{children};</Suspense>
    </div>
  );
}
