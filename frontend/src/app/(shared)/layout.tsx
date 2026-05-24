import React from "react";
import { headers } from "next/headers";
import SharedAuthGuard from "./guard/SharedAuthGuard";

export default async function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const userId = headersList.get("x-user-id") ?? undefined;

  return <SharedAuthGuard userId={userId}>{children}</SharedAuthGuard>;
}
