// constants/bookingFilters.ts
import { IconType } from "react-icons";
import { MdCheckCircle, MdPending, MdLogin, MdLogout, MdWarning } from "react-icons/md";

export type BookingStatus = "all" | "pending" | "confirmed" | "checked-in" | "checked-out" | "action-needed";

export interface FilterOption {
  id: BookingStatus;
  label: string;
  icon: IconType;
  color: {
    bg: string;           // Background color when inactive
    border: string;       // Border color
    text: string;         // Text color
    badge: string;        // Badge text color when inactive
    activeBg: string;     // Background when active (0B5173)
  };
  statusBadge: {
    color: string;        // Status badge text color (for dialog)
    bgColor: string;      // Status badge background color (for dialog)
  };
  cardBorder: string;     // Border color for booking cards
  cardBadge: {
    bg: string;           // Card badge background
    text: string;         // Card badge text
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
    statusBadge: {
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    cardBorder: "border-t-4 border-gray-400",
    cardBadge: {
      bg: "bg-gray-400",
      text: "text-white",
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
      badge: "text-gray-700",
      activeBg: "#0B5173",
    },
    statusBadge: {
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    cardBorder: "border-t-4 border-yellow-500",
    cardBadge: {
      bg: "bg-yellow-500",
      text: "text-white",
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
      badge: "text-gray-700",
      activeBg: "#0B5173",
    },
    statusBadge: {
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    cardBorder: "border-t-4 border-teal-500",
    cardBadge: {
      bg: "bg-teal-500",
      text: "text-white",
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
      badge: "text-gray-700",
      activeBg: "#0B5173",
    },
    statusBadge: {
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    cardBorder: "border-t-4 border-green-500",
    cardBadge: {
      bg: "bg-green-500",
      text: "text-white",
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
      badge: "text-gray-700",
      activeBg: "#0B5173",
    },
    statusBadge: {
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    cardBorder: "border-t-4 border-gray-500",
    cardBadge: {
      bg: "bg-gray-500",
      text: "text-white",
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
    statusBadge: {
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    cardBorder: "border-t-4 border-orange-600",
    cardBadge: {
      bg: "bg-orange-600",
      text: "text-white",
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

// Helper function to get status badge config (for dialog)
export const getStatusBadgeConfig = (status: BookingStatus) => {
  const filter = getFilterById(status);
  return filter?.statusBadge || { color: "text-gray-600", bgColor: "bg-gray-50" };
};

// Helper function to get card border config
export const getCardBorderConfig = (status: BookingStatus) => {
  const filter = getFilterById(status);
  return filter?.cardBorder || "border-t-4 border-gray-400";
};

// Helper function to get card badge config
export const getCardBadgeConfig = (status: BookingStatus) => {
  const filter = getFilterById(status);
  return filter?.cardBadge || { bg: "bg-gray-400", text: "text-white" };
};