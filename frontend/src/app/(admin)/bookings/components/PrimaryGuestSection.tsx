"use client";

import { DetailedBooking } from "../lib/mockData";

interface PrimaryGuestSectionProps {
  booking: DetailedBooking;
}

export default function PrimaryGuestSection({ booking }: PrimaryGuestSectionProps) {
  const { primaryGuest } = booking;

  return (
    <div>
      <h3 className="text-base font-semibold text-teal-800 mb-4">Primary Guest</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-sm text-teal-800">Name</span>
          <span className="text-sm font-semibold text-teal-800">{primaryGuest.name}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-teal-800">Age</span>
          <span className="text-sm font-semibold text-teal-800">{primaryGuest.age}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-teal-800">Nationality</span>
          <span className="text-sm font-semibold text-teal-800">{primaryGuest.nationality}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-teal-800">Contact number</span>
          <span className="text-sm font-semibold text-teal-800">{primaryGuest.phone}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-teal-800">Pool Access</span>
          <span className="text-sm font-semibold text-teal-800 text-right whitespace-pre-line">
            {primaryGuest.poolAccess}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-teal-800">With Vehicle</span>
          <span className="text-sm font-semibold text-teal-800">
            {primaryGuest.withVehicle ? "Yes" : "No"}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-teal-800">Valid ID</span>
        </div>
      </div>

      {/* Valid ID Image Placeholder */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center mt-4">
        {primaryGuest.validIdUrl ? (
          <img src={primaryGuest.validIdUrl} alt="Valid ID" className="max-h-full" />
        ) : (
          <span className="text-sm text-gray-400">ID Image</span>
        )}
      </div>
    </div>
  );
}