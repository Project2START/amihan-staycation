import React from "react";

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col">{children}</div>
  );
}
