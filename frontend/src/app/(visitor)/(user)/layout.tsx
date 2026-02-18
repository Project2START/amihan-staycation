import React from "react";
import UserHeader from "./components/UserHeader";
import ProtectedPagesGuard from "./ui/ProtectedPagesGuard";
import { cookies } from "next/headers";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  return (
    <>
      <ProtectedPagesGuard userId={userId}>
        <UserHeader />
        <main className="grow">{children}</main>
      </ProtectedPagesGuard>
    </>
  );
}
