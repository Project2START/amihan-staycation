import { bookingsResolver, bookingTypeDefs } from "../modules/booking";
import { registreeResolvers, registreeTypeDefs } from "../modules/registree";

export const typeDefs = [
  `#graphql
    type Query
    `,
  registreeTypeDefs,
  bookingTypeDefs,
];

export const resolvers = [registreeResolvers, bookingsResolver];
