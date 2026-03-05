"use client";
import { BookingStatusProvider } from "./BookingStatusContext";

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
