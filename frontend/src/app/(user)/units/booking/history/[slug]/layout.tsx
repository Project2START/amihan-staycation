import React, { Suspense } from "react";

export default async function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">
      <Suspense fallback={<p>Loading...</p>}>{children};</Suspense>
    </div>
  );
}
