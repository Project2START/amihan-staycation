"use client";
import { BookingStatusProvider } from "./BookingStatusContext";

import { useEffect, useState } from "react";

export default function ClientLayout({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: string;
}) {
  return (
    <BookingStatusProvider userId={userId}>{children}</BookingStatusProvider>
  );
}
