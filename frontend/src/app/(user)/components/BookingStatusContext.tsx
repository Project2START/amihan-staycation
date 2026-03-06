"use client";
import { createContext, useContext } from "react";
import { useQuery } from "@apollo/client/react";
import {
  GET_USER_BOOKINGS,
  I_GET_USER_BOOKINGS,
} from "../units/lib/bookingStatus-queries";
import { useAppSelector } from "@/lib/hooks";

interface BookingStatusContextValue {
  booking: I_GET_USER_BOOKINGS["bookingsByUser"][0] | null;
  loading: boolean;
  error: any;
  refetch: () => void;
}

const BookingStatusContext = createContext<
  BookingStatusContextValue | undefined
>(undefined);

export function BookingStatusProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: string;
}) {
  const user = useAppSelector((state) => state.users.data);

  // Only call useQuery if userId exists
  const shouldFetch = Boolean(userId);

  const { data, loading, error, refetch } = useQuery<I_GET_USER_BOOKINGS>(
    GET_USER_BOOKINGS,
    {
      fetchPolicy: "network-only",
      skip: !shouldFetch && user?.role !== "agent",
      variables: { userId },
    },
  );

  const booking =
    user?.role !== "agent" && data?.bookingsByUser?.length === 1
      ? data.bookingsByUser[0]
      : null;

  return (
    <BookingStatusContext.Provider value={{ booking, loading, error, refetch }}>
      {children}
    </BookingStatusContext.Provider>
  );
}

export function useBookingStatus() {
  const ctx = useContext(BookingStatusContext);
  if (!ctx)
    throw new Error(
      "useBookingStatus must be used within BookingStatusProvider",
    );
  return ctx;
}
