import React from "react";
import AdminLayoutGuard from "./ui/AdminLayoutGuard";
import HeaderAdmin from "./components/HeaderAdmin";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  return (
    <>
      <AdminLayoutGuard userId={userId}>
        <HeaderAdmin />
        <main className="grow">{children}</main>
      </AdminLayoutGuard>
    </>
  );
}
