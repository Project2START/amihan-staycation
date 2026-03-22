import React from "react";
import FooterAuth from "../shared/components/FooterAuth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="grow">{children}</main>
      <FooterAuth />
    </>
  );
}
