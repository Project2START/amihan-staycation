"use client";

import { DetailedBooking } from "../lib/mockData";

interface BookingDetailsSectionProps {
  booking: DetailedBooking;
}

export default function BookingDetailsSection({ booking }: BookingDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <span className="text-xs text-gray-600">Created on</span>
        <span className="text-xs text-gray-900 text-right">{booking.createdAt}</span>
      </div>

      <div className="flex justify-between items-start">
        <span className="text-sm text-teal-800">Unit</span>
        <span className="text-sm font-semibold text-teal-800">{booking.roomType}</span>
      </div>

      <div className="flex justify-between items-start">
        <span className="text-sm text-teal-800">Check-in</span>
        <span className="text-sm font-semibold text-teal-800">{booking.checkInTime}</span>
      </div>

      <div className="flex justify-between items-start">
        <span className="text-sm text-teal-800">Check-out</span>
        <span className="text-sm font-semibold text-teal-800">{booking.checkOutTime}</span>
      </div>
    </div>
  );
}