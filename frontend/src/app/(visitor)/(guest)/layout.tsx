import React from "react";
import HeaderPromptAuth from "@/app/shared/components/HeaderPromptAuth";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderPromptAuth />
      <main className="grow">{children}</main>
    </>
  );
}
