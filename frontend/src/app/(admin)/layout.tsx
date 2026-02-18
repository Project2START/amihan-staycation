import React from "react";
import HeaderAdmin from "./components/HeaderAdmin";
import { cookies } from "next/headers";
import ProtectedPagesGuard from "./ui/ProtectedPagesGuard";

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
        <HeaderAdmin />
        <main className="grow">{children}</main>
      </ProtectedPagesGuard>
    </>
  );
}
