import React from "react";
import { cookies } from "next/headers";
import SharedAuthGuard from "./guard/SharedAuthGuard";

export default async function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  return <SharedAuthGuard userId={userId}>{children}</SharedAuthGuard>;
}
