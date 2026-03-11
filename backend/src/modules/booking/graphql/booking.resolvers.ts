// import { MyContext } from "../../../graphql/context";

export const bookingsResolver = {
  Query: {
    bookingsByAdmin: (_parent: unknown, _args: unknown, contextValue: any) => {
      return contextValue.models.Booking.getAllBookingsByAdminId();
    },
    bookingsByAgent: (
      _parent: unknown,
      args: { agentId: string },
      contextValue: any,
    ) => {
      const { agentId } = args;
      return contextValue.models.Booking.getAllBookingsByAgent(agentId);
    },
    bookingById: (
      _parent: unknown,
      args: { id: string },
      contextValue: any,
    ) => {
      const { id } = args;
      return contextValue.models.Booking.getBookingById(id);
    },
    bookingsByUser: (_parent: unknown, _args: unknown, contextValue: any) => {
      return contextValue.models.Booking.getBookingsByUserId();
    },
    bookedDatesByProduct: (
      _parent: unknown,
      args: { productId: string },
      contextValue: any,
    ) => {
      return contextValue.models.Booking.getBookedDatesByProduct(
        args.productId,
      );
    },
    unitsByRole: (_parent: unknown, _args: unknown, contextValue: any) => {
      return contextValue.models.Booking.getUnitsByRole();
    },
    bookedDatesByAllProducts: (
      _parent: unknown,
      _args: unknown,
      contextValue: any,
    ) => {
      return contextValue.models.Booking.getBookedDatesByAllProducts();
    },
  },
};
