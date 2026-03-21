import { gql } from "@apollo/client";
import { BookingRow, UnitOption } from "./insights.types";

export const GET_ADMIN_INSIGHTS_BOOKINGS = gql`
  query GetAdminInsightsBookings {
    bookingsByAdmin {
      id
      status
      createdAt
      check_period {
        check_in
        check_out
      }
      guest_count
      product {
        id
        name
        price
        maxPersons
      }
    }
    unitsByRole {
      id
      name
    }
  }
`;

export interface IGetAdminInsightsBookings {
  bookingsByAdmin: BookingRow[];
  unitsByRole: UnitOption[];
}
