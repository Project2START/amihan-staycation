"use client";

import { DetailedBooking } from "../lib/mockData";
import AdditionalGuestItem from "./AdditionalGuestItem";

interface AdditionalGuestsSectionProps {
  booking: DetailedBooking;
}

export default function AdditionalGuestsSection({ booking }: AdditionalGuestsSectionProps) {
  const { additionalGuests = [] } = booking;

  if (additionalGuests.length === 0) {
    return null; // Don't show section if no additional guests
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-teal-800 mb-4">Additional Guests</h3>
      
      {additionalGuests.map((guest, index) => (
        <AdditionalGuestItem 
          key={guest.id} 
          guest={guest} 
          showBorder={index > 0}
        />
      ))}
    </div>
  );
}