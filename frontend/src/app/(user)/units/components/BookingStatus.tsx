"use client";

import { useBookingStatus } from "../../components/BookingStatusContext";
import { getBookingStatusText } from "../lib/getBookingStatusText";
import { getStatusColor } from "@/app/(admin)/my-bookings/lib/getStatusInfo";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { AnimatePresence, motion } from "motion/react";

export default function BookingStatus() {
  const { booking, loading, error } = useBookingStatus();
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
    initialInView: true,
  });

  if (loading || error || !booking) {
    return null;
  }

  const bookingStatusText = getBookingStatusText(booking.status);
  const bookingStatusColor = getStatusColor(booking.status);

  return (
    <>
      <div
        ref={ref}
        className="text-sm mb-[1rem] gap-x-3 flex items-center bg-primary-normal px-[0.5rem] py-[1rem] rounded-lg text-white font-bold"
      >
        <div
          className="w-[1rem] h-[1rem] rounded-full"
          style={
            bookingStatusColor
              ? { backgroundColor: bookingStatusColor }
              : undefined
          }
        ></div>
        <Link href={`/units/booking/${booking.id}`}>
          <p className="underline">{bookingStatusText}</p>
        </Link>
      </div>

      <AnimatePresence initial={false}>
        {!inView && (
          <motion.div
            initial={{ translateY: "-100%" }}
            animate={{ translateY: "0%" }}
            exit={{ translateY: "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-3 z-999 shadow-md/30 text-sm mb-[1rem] gap-x-3 flex items-center bg-primary-normal px-[0.5rem] py-[1rem] rounded-lg text-white font-bold"
          >
            <div
              className="w-[1rem] h-[1rem] rounded-full"
              style={
                bookingStatusColor
                  ? { backgroundColor: bookingStatusColor }
                  : undefined
              }
            ></div>
            <Link href={`/units/booking/${booking.id}`}>
              <p className="underline">{bookingStatusText}</p>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
