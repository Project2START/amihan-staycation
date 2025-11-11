import React from "react";
import AuthHeader from "./components/AuthHeader";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthHeader />
      <main>{children}</main>
    </>
  );
}
