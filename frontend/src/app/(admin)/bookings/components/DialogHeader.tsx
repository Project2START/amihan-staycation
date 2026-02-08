"use client";

import { IoClose } from "react-icons/io5";
import { BookingStatus } from "../constants/bookingFilters";
import { getStatusBadgeConfig, getFilterById } from "../constants/bookingFilters";

interface DialogHeaderProps {
  onClose: () => void;
  status: BookingStatus;
}

export default function DialogHeader({ onClose, status }: DialogHeaderProps) {
  const badgeConfig = getStatusBadgeConfig(status);
  const filter = getFilterById(status);
  const statusLabel = filter?.label || status;

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        type="button"
      >
        <IoClose className="w-5 h-5 text-gray-600" />
      </button>
      <h2 className="text-xl font-semibold text-teal-800">Booking Summary</h2>
      <span className={`px-3 py-1 rounded text-xs font-medium ${badgeConfig.color} ${badgeConfig.bgColor}`}>
        {statusLabel}
      </span>
    </div>
  );
}