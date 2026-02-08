"use client";

import { BookingStatus } from "../constants/bookingFilters";
import { getCardBorderConfig, getCardBadgeConfig, getFilterById } from "../constants/bookingFilters";

export interface Booking {
  id: string;
  guestName: string;
  phone: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
}

interface BookingCardProps {
  booking: Booking;
  onClick?: () => void;
}

export default function BookingCard({ booking, onClick }: BookingCardProps) {
  const borderConfig = getCardBorderConfig(booking.status);
  const badgeConfig = getCardBadgeConfig(booking.status);
  const filter = getFilterById(booking.status);
  const statusLabel = filter?.label || booking.status;

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${borderConfig} relative overflow-hidden cursor-pointer`}
      onClick={onClick}
    >
      {/* Status badge */}
      <div className="absolute top-0 right-0">
        <span className={`block px-4 py-1.5 text-xs font-medium rounded-tr-lg rounded-bl-lg ${badgeConfig.bg} ${badgeConfig.text}`}>
          {statusLabel}
        </span>
      </div>

      <div className="p-5 pt-6 flex items-start justify-between gap-8">
        {/* Left side - Guest info */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-base mb-1">{booking.guestName}</h3>
          <p className="text-gray-600 text-sm">{booking.phone}</p>
        </div>

        {/* Right side - Room/Date info */}
        <div className="flex-shrink-0 text-right pt-8">
          <p className="text-blue-600 text-sm font-medium">
            {booking.roomType} / {booking.checkInDate} - {booking.checkOutDate.split(" ")[1]}
          </p>
        </div>
      </div>
    </div>
  );
}