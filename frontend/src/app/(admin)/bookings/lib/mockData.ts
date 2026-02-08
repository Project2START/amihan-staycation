import { Booking } from "@/app/(admin)/bookings/components/BookingCard";

export interface DetailedBooking extends Booking {
  createdAt: string;
  checkInTime: string;
  checkOutTime: string;
  primaryGuest: {
    name: string;
    age: number;
    nationality: string;
    phone: string;
    poolAccess: string;
    withVehicle: boolean;
    validIdUrl?: string;
  };
  additionalGuests?: AdditionalGuest[];
}

export interface AdditionalGuest {
  id: string;
  name: string;
  age: number;
  belowThreeFeet: boolean;
  poolAccess: string;
  withVehicle: boolean;
  validIdUrl?: string;
}

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "1",
    guestName: "Nathaniel Andoy",
    phone: "09123456789",
    roomType: "Standard Room",
    checkInDate: "October 29",
    checkOutDate: "October 30",
    status: "pending",
  },
  {
    id: "2",
    guestName: "John Lawrence Amihan",
    phone: "09123456789",
    roomType: "Deluxe",
    checkInDate: "October 29",
    checkOutDate: "October 30",
    status: "confirmed",
  },
  {
    id: "3",
    guestName: "Aldwin Santos",
    phone: "09123456789",
    roomType: "Standard Room",
    checkInDate: "October 29",
    checkOutDate: "October 30",
    status: "checked-in",
  },
  {
    id: "4",
    guestName: "Rashed Carnain",
    phone: "09123456789",
    roomType: "Standard Room",
    checkInDate: "October 29",
    checkOutDate: "October 30",
    status: "action-needed",
  },
  {
    id: "5",
    guestName: "Nathaniel Andoy",
    phone: "09123456789",
    roomType: "Deluxe",
    checkInDate: "October 29",
    checkOutDate: "October 30",
    status: "pending",
  },
  {
    id: "6",
    guestName: "John Lawrence Amihan",
    phone: "09123456789",
    roomType: "Standard Room",
    checkInDate: "October 29",
    checkOutDate: "October 30",
    status: "checked-out",
  },
];

// Detailed booking data for the dialog
export const MOCK_DETAILED_BOOKINGS: Record<string, DetailedBooking> = {
  "1": {
    id: "1",
    guestName: "Nathaniel Andoy",
    phone: "09123456789",
    roomType: "Standard Room",
    checkInDate: "October 29",
    checkOutDate: "October 30",
    status: "pending",
    createdAt: "October 28, 2025, 11:21 PM",
    checkInTime: "Tue, Oct 29, 2:00 PM",
    checkOutTime: "Wed, Oct 30, 12:00 PM",
    primaryGuest: {
      name: "Nathaniel Andoy",
      age: 20,
      nationality: "Filipino",
      phone: "09123456789",
      poolAccess: "Oct 29 - PM\nOct 30 - AM",
      withVehicle: true,
    },
    additionalGuests: [
      {
        id: "1",
        name: "Rashed Carnain",
        age: 20,
        belowThreeFeet: false,
        poolAccess: "Oct 29 - PM\nOct 30 - AM",
        withVehicle: false,
      },
      {
        id: "2",
        name: "John Lawrence Amihan",
        age: 20,
        belowThreeFeet: false,
        poolAccess: "Oct 29 - PM\nOct 30 - AM",
        withVehicle: false,
      },
    ],
  },
  "2": {
    id: "2",
    guestName: "John Lawrence Amihan",
    phone: "09123456789",
    roomType: "Deluxe",
    checkInDate: "October 29",
    checkOutDate: "October 30",
    status: "confirmed",
    createdAt: "October 28, 2025, 10:15 AM",
    checkInTime: "Tue, Oct 29, 2:00 PM",
    checkOutTime: "Wed, Oct 30, 12:00 PM",
    primaryGuest: {
      name: "John Lawrence Amihan",
      age: 25,
      nationality: "Filipino",
      phone: "09123456789",
      poolAccess: "Oct 29 - PM\nOct 30 - AM",
      withVehicle: true,
    },
    additionalGuests: [],
  },
  "3": {
    id: "3",
    guestName: "Aldwin Santos",
    phone: "09123456789",
    roomType: "Standard Room",
    checkInDate: "October 29",
    checkOutDate: "October 30",
    status: "checked-in",
    createdAt: "October 27, 2025, 3:30 PM",
    checkInTime: "Tue, Oct 29, 2:00 PM",
    checkOutTime: "Wed, Oct 30, 12:00 PM",
    primaryGuest: {
      name: "Aldwin Santos",
      age: 28,
      nationality: "Filipino",
      phone: "09123456789",
      poolAccess: "Oct 29 - PM\nOct 30 - AM",
      withVehicle: false,
    },
    additionalGuests: [],
  },
  "4": {
    id: "4",
    guestName: "Rashed Carnain",
    phone: "09123456789",
    roomType: "Standard Room",
    checkInDate: "October 29",
    checkOutDate: "October 30",
    status: "action-needed",
    createdAt: "October 28, 2025, 9:45 AM",
    checkInTime: "Tue, Oct 29, 2:00 PM",
    checkOutTime: "Wed, Oct 30, 12:00 PM",
    primaryGuest: {
      name: "Rashed Carnain",
      age: 22,
      nationality: "Filipino",
      phone: "09123456789",
      poolAccess: "Oct 29 - PM\nOct 30 - AM",
      withVehicle: true,
    },
    additionalGuests: [],
  },
  "5": {
    id: "5",
    guestName: "Nathaniel Andoy",
    phone: "09123456789",
    roomType: "Deluxe",
    checkInDate: "October 29",
    checkOutDate: "October 30",
    status: "pending",
    createdAt: "October 28, 2025, 2:00 PM",
    checkInTime: "Tue, Oct 29, 2:00 PM",
    checkOutTime: "Wed, Oct 30, 12:00 PM",
    primaryGuest: {
      name: "Nathaniel Andoy",
      age: 20,
      nationality: "Filipino",
      phone: "09123456789",
      poolAccess: "Oct 29 - PM\nOct 30 - AM",
      withVehicle: false,
    },
    additionalGuests: [],
  },
  "6": {
    id: "6",
    guestName: "John Lawrence Amihan",
    phone: "09123456789",
    roomType: "Standard Room",
    checkInDate: "October 29",
    checkOutDate: "October 30",
    status: "checked-out",
    createdAt: "October 27, 2025, 8:00 AM",
    checkInTime: "Tue, Oct 29, 2:00 PM",
    checkOutTime: "Wed, Oct 30, 12:00 PM",
    primaryGuest: {
      name: "John Lawrence Amihan",
      age: 25,
      nationality: "Filipino",
      phone: "09123456789",
      poolAccess: "Oct 29 - PM\nOct 30 - AM",
      withVehicle: true,
    },
    additionalGuests: [],
  },
};

// Helper function to get detailed booking by ID
export const getDetailedBookingById = (id: string): DetailedBooking | undefined => {
  return MOCK_DETAILED_BOOKINGS[id];
};