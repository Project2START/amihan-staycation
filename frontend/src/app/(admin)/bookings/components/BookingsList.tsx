"use client";

import { useState } from "react";
import BookingCard, { Booking } from "./BookingCard";
import { BookingStatus } from "../constants/bookingFilters";
import BookingDetailsDialog from "./BookingDetailsDialog";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";

interface BookingsListProps {
  bookings: Booking[];
  activeFilter: BookingStatus;
}

export default function BookingsList({ bookings, activeFilter }: BookingsListProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredBookings = activeFilter === "all" 
    ? bookings 
    : bookings.filter(booking => booking.status === activeFilter);

  const handleCardClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBooking(null);
  };

  if (filteredBookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No bookings found for this filter.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookings.map((booking) => (
          <BookingCard 
            key={booking.id} 
            booking={booking} 
            onClick={() => handleCardClick(booking)}
          />
        ))}
      </div>

      <DialogBaseContent
        openDialog={isDialogOpen}
        onCloseDialog={handleCloseDialog}
        enableClickOutside={true}
      >
        {selectedBooking && (
          <BookingDetailsDialog
            booking={selectedBooking}
            onClose={handleCloseDialog}
          />
        )}
      </DialogBaseContent>
    </>
  );
}