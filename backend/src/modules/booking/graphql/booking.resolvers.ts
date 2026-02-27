// import { MyContext } from "../../../graphql/context";

export const bookingsResolver = {
  Query: {
    bookingsByAdmin: (_parent: unknown, _args: unknown, contextValue: any) => {
      return contextValue.models.Booking.getAllBookingsByAdminId();
    },
    bookingById: (
      _parent: unknown,
      args: { id: string },
      contextValue: any,
    ) => {
      const { id } = args;
      return contextValue.models.Booking.getBookingById(id);
    },
  },
};
