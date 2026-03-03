import React, { Suspense } from "react";
import AdminHistoryLoading from "./loading";

export default async function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">
      <Suspense fallback={<AdminHistoryLoading />}>{children}</Suspense>
    </div>
  );
}
