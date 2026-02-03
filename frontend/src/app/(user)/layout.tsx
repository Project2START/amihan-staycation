import React from "react";
import HeaderUser from "./components/HeaderUser";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderUser />
      <main className="grow">{children}</main>
    </>
  );
}
