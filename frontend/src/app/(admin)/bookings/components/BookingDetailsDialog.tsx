"use client";

import { Booking } from "./BookingCard";
import { getDetailedBookingById } from "../lib/mockData";
import DialogHeader from "./DialogHeader";
import BookingDetailsSection from "./BookingDetailsSection";
import PrimaryGuestSection from "./PrimaryGuestSection";
import AdditionalGuestsSection from "./AdditionalGuestsSection";
import SecurityDepositSection from "./SecurityDepositSection";
import DepositStatusControl from "./DepositStatusControl";

interface BookingDetailsDialogProps {
  booking: Booking | null;
  onClose: () => void;
}

export default function BookingDetailsDialog({ booking, onClose }: BookingDetailsDialogProps) {
  if (!booking) return null;

  // Get detailed booking data
  const detailedBooking = getDetailedBookingById(booking.id);
  
  if (!detailedBooking) return null;

  return (
    <div className="relative text-secondary-normal text-xs px-[1.5rem] py-[2rem]">
      {/* Header */}
      <DialogHeader onClose={onClose} status={detailedBooking.status} />

      {/* Content */}
      <div className="h-[30rem] overflow-y-auto px-[0.25rem] pb-[1rem]">
        <div className="space-y-6">
          {/* Booking Details */}
          <BookingDetailsSection booking={detailedBooking} />

          {/* Primary Guest */}
          <PrimaryGuestSection booking={detailedBooking} />

          {/* Additional Guests */}
          <AdditionalGuestsSection booking={detailedBooking} />

          {/* Security Deposit */}
          <SecurityDepositSection />
        </div>
      </div>

      {/* Bottom Section with Status Control */}
      <div className="mt-[1rem] flex items-end justify-between">
        <DepositStatusControl />
      </div>
    </div>
  );
}