import { gql } from "@apollo/client";
import { Status } from "./getStatusInfo";

export interface I_GET_ADMIN_BOOKINGS {
  bookingsByAdmin: {
    id: string | null;
    name: string | null;
    contact_number: string | null;
    check_period: {
      check_in: string | null;
      check_out: string | null;
    };
    status: Status;
    product: {
      name: string | null;
    };
  }[];
}

export const GET_ADMIN_BOOKINGS = gql`
  query GetBookingsByAdmin {
    bookingsByAdmin {
      id
      name
      contact_number
      check_period {
        check_in
        check_out
      }
      status
      product {
        name
      }
    }
  }
`;
