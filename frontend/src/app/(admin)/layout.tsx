import React from "react";
import { cookies } from "next/headers";
import ProtectedPagesGuard from "./ui/ProtectedPagesGuard";
import AdminAvailabilityCalendar from "./components/AdminAvailabilityCalendar";
import AdminDesktopShell from "./components/AdminDesktopShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  return (
    <>
      <ProtectedPagesGuard userId={userId}>
        <AdminDesktopShell>{children}</AdminDesktopShell>
        <AdminAvailabilityCalendar />
      </ProtectedPagesGuard>
    </>
  );
}
