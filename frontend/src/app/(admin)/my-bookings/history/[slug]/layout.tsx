import React from "react";

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">{children}</div>
  );
}
