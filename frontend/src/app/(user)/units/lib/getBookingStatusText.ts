import { Status } from "@/app/(admin)/my-bookings/lib/getStatusInfo";

export function getBookingStatusText(status: Status): string {
  const messages: Record<Status, string> = {
    pending: "Your booking is currently pending.",
    confirmed: "Your booking is confirmed. Congratulations!",
    checked_in: "You are currently checked in.",
    checked_out: "You have checked out. Thank you for staying!",
    action_required: "Action is required for your booking.",
    expired: "Your booking has expired. You can create a new one!",
    cancelled: "Your booking has been cancelled. Tap here for more details",
  };

  return messages[status] ?? "Booking status unavailable.";
}
