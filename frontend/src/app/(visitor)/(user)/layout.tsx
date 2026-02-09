import React from "react";
import UserLayoutGuard from "./ui/UserLayoutGuard";
import UserHeader from "./components/UserHeader";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <UserLayoutGuard> */}
      <UserHeader />
      <main className="grow">{children}</main>
      {/* </UserLayoutGuard> */}
    </>
  );
}
