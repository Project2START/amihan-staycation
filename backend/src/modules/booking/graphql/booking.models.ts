import { requireAuth } from "../../../shared/helpers/requireAuth";
import { requireRole } from "../../../shared/helpers/requireRole";
import { bookingService } from "../services/booking.service";

export const generateBookingModel = ({ user }: { user: any }) => ({
  getAllBookingsByAdminId: async () => {
    requireAuth(user);
    requireRole(user, ["admin"]);

    const bookings = await bookingService.getAllByAdmin(user.user_id);

    return bookings.map((booking) => {
      const { contact_number, name, check_period, status, product, id } =
        booking;
      return {
        contact_number,
        name,
        check_period,
        status,
        product: { name: product.name },
        id,
      };
    });
  },
  getBookingById: async (id: string) => {
    requireAuth(user);
    requireRole(user, ["admin", "user", "agent"]);

    const booking = await bookingService.get(id, user.user_id);

    const {
      contact_number,
      name,
      check_period,
      status,
      product,
      createdAt,
      additional_guests,
      image_valid_id_url,
      image_payment_proof_url,
      pool_access,
      age,
      nationality,
      with_vehicle,
      userId,
      paymentMethod,
      history,
      status_message,
    } = booking;

    const payload: any = {
      id,
      status,
      createdAt: createdAt.toISOString(),
      product: { name: product.name, id: product.id },
      check_period,
      name,
      age,
      nationality,
      contact_number,
      pool_access,
      history,
      with_vehicle,
      image_valid_id_url,
      additional_guests,
      image_payment_proof_url,
      userId,
      status_message,
    };

    if (paymentMethod) {
      payload.paymentMethod = {
        id: paymentMethod.id,
        payment_method: paymentMethod.payment_method,
        account_name: paymentMethod.account_name,
        account_number: paymentMethod.account_number,
        image_url: paymentMethod.image_url,
      };
    }
    return payload;
  },
  getBookingsByUserId: async function () {
    const bookings = await bookingService.getAllByUser(user.user_id);

    const bookingsByUserId = await Promise.all(
      bookings.map((b) => this.getBookingById(b.id)),
    );
    return bookingsByUserId;
  },
});
