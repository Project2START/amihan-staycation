import React from "react";
import FooterMain from "@/app/shared/components/FooterMain";
import RoleGuard from "./guard/RoleGuard";
import { headers } from "next/headers";
import UserHeader from "./components/UserHeader";
import UserAvailabilityCalendar from "./components/UserAvailabilityCalendar";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const userId = headersList.get("x-user-id") ?? undefined;

  return (
    <RoleGuard userId={userId}>
      <UserHeader />
      <main>{children}</main>
      <UserAvailabilityCalendar />
      <FooterMain />
    </RoleGuard>
  );
}
