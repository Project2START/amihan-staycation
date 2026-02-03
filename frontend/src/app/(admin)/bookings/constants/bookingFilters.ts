// constants/bookingFilters.ts
import { IconType } from "react-icons";
import { MdCheckCircle, MdPending, MdLogin, MdLogout, MdWarning } from "react-icons/md";

export type BookingStatus = "all" | "pending" | "confirmed" | "checked-in" | "checked-out" | "action-needed";

export interface FilterOption {
  id: BookingStatus;
  label: string;
  icon: IconType;
  color: {
    bg: string;      // Background color when inactive
    border: string;  // Border color
    text: string;    // Text color
    badge: string;   // Badge color when inactive (009EA9)
    activeBg: string; // Background when active (0B5173)
  };
  description: string;
}

export const BOOKING_FILTERS: FilterOption[] = [
  {
    id: "all",
    label: "All",
    icon: MdCheckCircle,
    color: {
      bg: "bg-white",
      border: "border-gray-400",
      text: "text-gray-700",
      badge: "text-gray-700",
      activeBg: "#0B5173",
    },
    description: "View all bookings",
  },
  {
    id: "pending",
    label: "Pending",
    icon: MdPending,
    color: {
      bg: "bg-white",
      border: "border-gray-400",
      text: "text-gray-700",
      badge: "text-gray-700", // Inactive badge text color
      activeBg: "#0B5173", // Active background
    },
    description: "Awaiting confirmation",
  },
  {
    id: "confirmed",
    label: "Confirmed",
    icon: MdCheckCircle,
    color: {
      bg: "bg-white",
      border: "border-gray-400",
      text: "text-gray-700",
      badge: "text-gray-700", // Inactive badge text color
      activeBg: "#0B5173", // Active background
    },
    description: "Booking confirmed",
  },
  {
    id: "checked-in",
    label: "Checked-In",
    icon: MdLogin,
    color: {
      bg: "bg-white",
      border: "border-gray-400",
      text: "text-gray-700",
      badge: "text-gray-700", // Inactive badge text color
      activeBg: "#0B5173", // Active background
    },
    description: "Guest checked in",
  },
  {
    id: "checked-out",
    label: "Checked-Out",
    icon: MdLogout,
    color: {
      bg: "bg-white",
      border: "border-gray-400",
      text: "text-gray-700",
      badge: "text-gray-700", // Inactive badge text color
      activeBg: "#0B5173", // Active background
    },
    description: "Guest checked out",
  },
  {
    id: "action-needed",
    label: "Action Needed",
    icon: MdWarning,
    color: {
      bg: "bg-white",
      border: "border-gray-400",
      text: "text-gray-700",
      badge: "text-gray-700",
      activeBg: "#0B5173",
    },
    description: "Requires attention",
  },
];

// Helper function to get filter by ID
export const getFilterById = (id: BookingStatus): FilterOption | undefined => {
  return BOOKING_FILTERS.find(filter => filter.id === id);
};

// Helper function to get all filter labels
export const getFilterLabels = (): Record<BookingStatus, string> => {
  return BOOKING_FILTERS.reduce((acc, filter) => {
    acc[filter.id] = filter.label;
    return acc;
  }, {} as Record<BookingStatus, string>);
};