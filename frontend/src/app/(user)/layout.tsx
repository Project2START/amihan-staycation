import React from "react";
import FooterMain from "@/app/shared/components/FooterMain";
import RoleGuard from "./guard/RoleGuard";
import { cookies } from "next/headers";
import UserHeader from "./components/UserHeader";
import UserAvailabilityCalendar from "./components/UserAvailabilityCalendar";
// import ClientLayout from "./components/ClientLayout";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  return (
    <RoleGuard userId={userId}>
      {/* <ClientLayout userId={userId}> */}
      <UserHeader />
      <main>{children}</main>
      <UserAvailabilityCalendar />
      <FooterMain />
      {/* </ClientLayout> */}
    </RoleGuard>
  );
}
