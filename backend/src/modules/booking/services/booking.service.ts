import { uploadFileToSupabase } from "../../../shared/helpers/uploadFileToSupabase";
import { BookingDTO } from "../schemas/booking.schema";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../shared/helpers/appErrors";
import { supabase } from "../../../shared/lib/supabase";
import { bookingRepository } from "../repositories/bookings.repository";
import { productService } from "../../product/services/product.service";
import { paymentMethodService } from "../../paymentMethod/services/paymentMethod.service";
import { userRepository } from "../../user/repositories/user.repository";

class BookingService {
  async create(
    booking: BookingDTO,
    files: Record<string, Express.Multer.File[]>,
    userId: string,
  ) {
    const {
      age,
      agree_terms,
      check_period,
      contact_number,
      name,
      nationality,
      payment_method_id,
      pool_access,
      product_id,
      with_vehicle,
      additional_guests,
    } = booking;
    const product = await productService.get(product_id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (!product.userId) {
      throw new NotFoundError("User not found");
    }

    let paymentMethod;

    if (payment_method_id) {
      paymentMethod = await paymentMethodService.get(
        payment_method_id,
        product.userId,
      );
    }

    const valid_id = files.valid_id;
    const payment_proof = files.payment_proof;
    const additional_guests_validIds = files.additional_guests_validIds;

    if (!payment_proof || payment_proof.length === 0) {
      throw new BadRequestError("Payment proof file is required.");
    }
    if (!valid_id || valid_id.length === 0) {
      throw new BadRequestError("Valid ID file is required.");
    }

    const valid_id_file = await uploadFileToSupabase(valid_id[0], "userIds");
    const payment_proof_file = await uploadFileToSupabase(
      payment_proof[0],
      "paymentProofs",
    );

    let additional_guests_data: any = [];

    if (additional_guests) {
      let valid_id_index = 0;

      const mapped_additional_guests = additional_guests.map(
        (additional_guest) => {
          if (!additional_guest.below_three_feet) {
            const id_index = additional_guests_validIds[valid_id_index];

            valid_id_index++;

            return {
              ...additional_guest,
              additional_guest_validId: id_index,
            };
          }
          return { ...additional_guest, additional_guest_validId: undefined };
        },
      );

      additional_guests_data = await Promise.all(
        mapped_additional_guests.map(async (additional_guest) => {
          const { additional_guest_validId, ...rest } = additional_guest;

          if (additional_guest_validId) {
            const additional_guest_file = await uploadFileToSupabase(
              additional_guest_validId,
              "userIds",
            );

            return {
              ...rest,
              image_valid_id_url: additional_guest_file.publicUrl,
            };
          } else {
            return {
              ...rest,
              image_valid_id_url: null,
            };
          }
        }),
      );
    }

    try {
      const payload: any = {
        age,
        check_period,
        contact_number,
        image_payment_proof_url: payment_proof_file.publicUrl,
        image_valid_id_url: valid_id_file.publicUrl,
        name,
        nationality,
        pool_access,
        agree_terms,
        with_vehicle,
        additional_guests: additional_guests_data,
        user: { connect: { id: userId } },
        admin: { connect: { id: product.userId } },
        product: { connect: { id: product.id } },
      };

      if (paymentMethod && paymentMethod.id) {
        payload.paymentMethod = { connect: { id: paymentMethod.id } };
      }

      await bookingRepository.create(payload);

      return;
    } catch (error) {
      await supabase.storage
        .from("images")
        .remove([valid_id_file.filePath, payment_proof_file.filePath]);
      throw error;
    }
  }
  async get(bookingId: string, id: string) {
    const booking = await bookingRepository.findById(bookingId);
    const user = await userRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (user.role === "admin" && booking.adminId !== id) {
      throw new ForbiddenError(
        "You do not have permission to get this booking",
      );
    }
    if (user.role === "user" && booking.userId !== id) {
      throw new ForbiddenError(
        "You do not have permission to get this booking",
      );
    }

    return booking;
  }
  async getAllByAdmin(adminId: string) {
    const bookings = await bookingRepository.findAllByAdminId(adminId);

    // const bookingsFormatted = bookings.map((booking) => {
    //   const { ...rest } = booking;

    //   return rest;
    // });

    return bookings;
  }
  async getAllByUser(userId: string) {
    const bookings = await bookingRepository.findAllByUserId(userId);

    return bookings;
  }
}

export const bookingService = new BookingService();
