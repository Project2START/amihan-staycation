import { gql } from "@apollo/client";
import { Status } from "../../lib/getStatusInfo";

export interface I_GET_BOOKING {
  bookingById: {
    id: string;
    status: Status;
    status_message: string;
    createdAt?: string | null;
    product?: { name?: string | null; id?: string | null } | null;
    paymentMethod?: {
      payment_method?: string | null;
      account_name?: string | null;
      account_number?: string | null;
      image_url?: string | null;
      id?: string | null;
    } | null;
    check_period?: {
      check_in?: string | null;
      check_out?: string | null;
    } | null;
    name?: string | null;
    age?: number | null;
    nationality?: string | null;
    contact_number?: string | null;
    pool_access?: {
      hasAccess?: boolean | null;
      access?:
        | { date?: string | null; am?: string | null; pm?: string | null }[]
        | null;
    } | null;
    with_vehicle?: boolean | null;
    image_valid_id_url?: string | null;
    additional_guests?:
      | ({
          age?: number | null;
          name?: string | null;
          pool_access?: {
            hasAccess?: boolean | null;
            access?:
              | {
                  date?: string | null;
                  am?: string | null;
                  pm?: string | null;
                }[]
              | null;
          } | null;
          with_vehicle?: boolean | null;
          below_three_feet?: boolean | null;
          image_valid_id_url?: string | null;
        } | null)[]
      | null;
    image_payment_proof_url?: string | null;
    userId?: string | null;
    history?: {
      message?: string | null;
      ownerName?: string | null;
      hasUserResponded: boolean;
    }[];
  } | null;
}

export const GET_BOOKING = gql`
  query GetBookingById($id: String!) {
    bookingById(id: $id) {
      id
      status
      status_message
      createdAt
      product {
        name
        id
      }
      paymentMethod {
        payment_method
        account_name
        account_number
        image_url
        id
      }
      check_period {
        check_in
        check_out
      }
      name
      age
      nationality
      contact_number
      pool_access {
        hasAccess
        access {
          date
          am
          pm
        }
      }
      with_vehicle
      image_valid_id_url
      additional_guests {
        age
        name
        pool_access {
          hasAccess
          access {
            date
            am
            pm
          }
        }
        with_vehicle
        below_three_feet
        image_valid_id_url
      }
      image_payment_proof_url
      userId
      history {
        message
        ownerName
        hasUserResponded
      }
    }
  }
`;
