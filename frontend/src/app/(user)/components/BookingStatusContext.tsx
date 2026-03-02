"use client";
import { createContext, useContext } from "react";
import { useQuery } from "@apollo/client/react";
import {
  GET_USER_BOOKINGS,
  I_GET_USER_BOOKINGS,
} from "../units/lib/bookingStatus-queries";

interface BookingStatusContextValue {
  booking: I_GET_USER_BOOKINGS["bookingsByUser"][0] | null;
  loading: boolean;
  error: any;
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
  // Only call useQuery if userId exists
  const shouldFetch = Boolean(userId);
  const { data, loading, error } = useQuery<I_GET_USER_BOOKINGS>(
    GET_USER_BOOKINGS,
    {
      fetchPolicy: "network-only",
      skip: !shouldFetch,
      variables: { userId },
    },
  );

  const booking =
    data?.bookingsByUser?.length === 1 ? data.bookingsByUser[0] : null;

  return (
    <BookingStatusContext.Provider value={{ booking, loading, error }}>
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
