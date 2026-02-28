import { Status } from "@/app/(admin)/my-bookings/lib/getStatusInfo";
import { gql } from "@apollo/client";

export interface I_GET_USER_BOOKINGS {
  bookingsByUser: {
    id: string;
    status: Status;
  }[];
}

export const GET_USER_BOOKINGS = gql`
  query GetBookingsByUser {
    bookingsByUser {
      id
      status
    }
  }
`;
