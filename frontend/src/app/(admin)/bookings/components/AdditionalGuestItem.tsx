"use client";

import { AdditionalGuest } from "../lib/mockData";

interface AdditionalGuestItemProps {
  guest: AdditionalGuest;
  showBorder?: boolean;
}

export default function AdditionalGuestItem({ guest, showBorder = false }: AdditionalGuestItemProps) {
  return (
    <div className={showBorder ? "mt-6 pt-6 border-t border-gray-200" : ""}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-sm text-teal-800">Name</span>
          <span className="text-sm font-semibold text-teal-800">{guest.name}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-teal-800">Age</span>
          <span className="text-sm font-semibold text-teal-800">{guest.age}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-teal-800">Below 3 Feet</span>
          <span className="text-sm font-semibold text-teal-800">
            {guest.belowThreeFeet ? "Yes" : "No"}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-teal-800">Pool Access</span>
          <span className="text-sm font-semibold text-teal-800 text-right whitespace-pre-line">
            {guest.poolAccess}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-teal-800">With Vehicle</span>
          <span className="text-sm font-semibold text-teal-800">
            {guest.withVehicle ? "Yes" : "No"}
          </span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-sm text-teal-800">Valid ID</span>
        </div>

        {/* Valid ID Image Placeholder */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center mt-2">
          <span className="text-sm text-gray-400">ID Image</span>
        </div>
      </div>
    </div>
  );
}