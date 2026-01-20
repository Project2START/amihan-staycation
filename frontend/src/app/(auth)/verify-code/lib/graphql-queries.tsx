import { gql } from "@apollo/client";

export interface REGISTREE_NEXTRESEND_TYPE {
  registree: {
    nextAllowedResend: string;
  };
}
export const GET_REGISTREE_NEXTRESEND = gql`
  query GetNextResend($id: ID!) {
    registree(id: $id) {
      nextAllowedResend
    }
  }
`;
