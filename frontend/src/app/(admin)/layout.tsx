import React from "react";
import { headers } from "next/headers";
import ProtectedPagesGuard from "./ui/ProtectedPagesGuard";
import AdminAvailabilityCalendar from "./components/AdminAvailabilityCalendar";
import AdminDesktopShell from "./components/AdminDesktopShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const userId = headersList.get("x-user-id") ?? undefined;

  return (
    <>
      <ProtectedPagesGuard userId={userId}>
        <AdminDesktopShell>{children}</AdminDesktopShell>
        <AdminAvailabilityCalendar />
      </ProtectedPagesGuard>
    </>
  );
}
