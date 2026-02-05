import React from "react";
import AdminLayoutGuard from "./ui/AdminLayoutGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminLayoutGuard>
        <main className="grow">{children}</main>
      </AdminLayoutGuard>
    </>
  );
}
