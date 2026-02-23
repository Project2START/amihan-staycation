import React from "react";
import FooterMain from "@/app/shared/components/FooterMain";
import RoleGuard from "./guard/RoleGuard";
import { cookies } from "next/headers";
import UserHeader from "./components/UserHeader";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  return (
    <>
      <RoleGuard userId={userId}>
        <UserHeader />
        <main>{children}</main>
        <FooterMain />
      </RoleGuard>
    </>
  );
}
