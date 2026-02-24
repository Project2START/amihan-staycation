import { UnauthorizedError } from "../../../shared/helpers/appErrors";
import { requireAuth } from "../../../shared/helpers/requireAuth";
import { requireRole } from "../../../shared/helpers/requireRole";
import { bookingService } from "../services/booking.service";

export const generateBookingModel = ({ user }: { user: any }) => ({
  getAllBookingsByAdminId: async () => {
    requireAuth(user);
    requireRole(user, ["admin"]);

    const bookings = await bookingService.getAllByAdmin(user.user_id);

    return bookings.map((booking) => {
      const { contact_number, name, check_period, status, product } = booking;
      return {
        contact_number,
        name,
        check_period,
        status,
        product: { name: product.name },
      };
    });
  },
});
