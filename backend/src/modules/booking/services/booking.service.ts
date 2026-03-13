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
import { BookingUpdateDTO } from "../schemas/bookingUpdate.schema";
import { notificationRepository } from "../../notification/repositories/notification.repository";
import { io } from "../../../app";
import {
  BOOKING_CHECK_IN_TIME,
  BOOKING_CHECK_OUT_TIME,
  BOOKING_EXPIRY_HOURS,
} from "../../../shared/constants/bookingTimes";

type BookingCheckPeriod = {
  check_in?: string;
  check_out?: string;
};

const buildDateTime = (date: string, time: string): Date => {
  return new Date(`${date}T${time}`);
};

class BookingService {
  async runAutomatedStatusTransitions(now: Date = new Date()) {
    const bookings = await bookingRepository.findForStatusAutomation();

    let expired = 0;
    let checkedIn = 0;
    let checkedOut = 0;

    for (const booking of bookings) {
      const checkPeriod = booking.check_period as BookingCheckPeriod;
      const checkInDateTime = checkPeriod?.check_in
        ? buildDateTime(checkPeriod.check_in, BOOKING_CHECK_IN_TIME)
        : null;
      const checkOutDateTime = checkPeriod?.check_out
        ? buildDateTime(checkPeriod.check_out, BOOKING_CHECK_OUT_TIME)
        : null;

      if (
        booking.status === "pending" ||
        booking.status === "action_required"
      ) {
        const isOlderThanExpiry =
          now.getTime() - booking.createdAt.getTime() >=
          BOOKING_EXPIRY_HOURS * 60 * 60 * 1000;

        const hasCheckInPassed = checkInDateTime
          ? now >= checkInDateTime
          : false;

        if (isOlderThanExpiry || hasCheckInPassed) {
          await bookingRepository.update(booking.id, { status: "expired" });
          expired++;
        }
        continue;
      }

      if (booking.status === "confirmed") {
        if (checkInDateTime && now >= checkInDateTime) {
          await bookingRepository.update(booking.id, { status: "checked_in" });
          checkedIn++;
        }
        continue;
      }

      if (booking.status === "checked_in") {
        if (checkOutDateTime && now >= checkOutDateTime) {
          await bookingRepository.update(booking.id, { status: "checked_out" });
          checkedOut++;
        }
      }
    }

    return {
      expired,
      checkedIn,
      checkedOut,
      totalProcessed: bookings.length,
    };
  }

  async update(
    bookingId: string,
    adminId: string,
    updateData: BookingUpdateDTO,
  ) {
    const { action_items, status, status_message } = updateData;

    const booking = await bookingRepository.findById(bookingId);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }
    if (booking.adminId !== adminId) {
      throw new ForbiddenError("You do not own this booking");
    }

    const notifyUser = async (id: string | null) => {
      const unreadNotifCount =
        await notificationRepository.countUnreadByDestination(id ?? "");

      io.to(`notifications:${id}`).emit("notification:unread-count", {
        count: unreadNotifCount,
      });
    };

    if (updateData.status === "action_required") {
      const userFirstName = booking.user?.first_name;
      const userLastName = booking.user?.last_name;

      const userName = userFirstName && userLastName;

      const ownerFirstName = booking.admin?.first_name;
      const ownerLastName = booking.admin?.last_name;

      const ownerName = ownerFirstName && ownerLastName;

      const newHistory = await bookingRepository.createBookingHistory({
        userName: userName
          ? `${userFirstName} ${userLastName}`
          : userFirstName
            ? userFirstName
            : userLastName
              ? userLastName
              : "Deleted user",
        ownerName: ownerName
          ? `${ownerFirstName} ${ownerLastName}`
          : ownerFirstName
            ? ownerFirstName
            : ownerLastName
              ? ownerLastName
              : "Deleted user",
        booking: { connect: { id: bookingId } },
        hasUserResponded: false,
        action_items,
        message: status_message,
      });

      try {
        const updatedBooking = await bookingRepository.update(bookingId, {
          status,
          status_message,
        });

        await notificationRepository.create({
          hasRead: false,
          isPublic: false,
          title: "Booking Action Required",
          message:
            "Action is required for your booking. Please review your reservation details and wait for approval updates.",
          pathId: updatedBooking.id,
          pathType: "booking",
          userDestinationId: updatedBooking.userId,
          userOwnerId: updatedBooking.adminId,
        });

        await notifyUser(updatedBooking.userId);
        return;
      } catch (error) {
        await bookingRepository.deleteBookingHistory(newHistory.id);
        throw error;
      }
    }

    const updatedBooking = await bookingRepository.update(bookingId, {
      status,
      status_message,
    });

    await notificationRepository.create({
      hasRead: false,
      isPublic: false,
      title: "Booking Cancelled",
      message:
        "Your reservation has been cancelled. If this was a mistake, you may create a new booking anytime.",
      pathId: updatedBooking.id,
      pathType: "booking",
      userDestinationId: updatedBooking.userId,
      userOwnerId: updatedBooking.adminId,
    });

    await notifyUser(updatedBooking.userId);
    return;
  }

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

      const newBooking = await bookingRepository.create(payload);

      await notificationRepository.create({
        hasRead: false,
        isPublic: false,
        title: "Booking Request Sent",
        message: "Your reservation has been created and is pending approval.",
        pathId: newBooking.id,
        pathType: "booking",
        userDestinationId: newBooking.userId,
        userOwnerId: newBooking.adminId,
      });

      const unreadNotifCount =
        await notificationRepository.countUnreadByDestination(
          newBooking.userId ?? "",
        );

      io.to(`notifications:${newBooking.userId}`).emit(
        "notification:unread-count",
        { count: unreadNotifCount },
      );

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

    return bookings;
  }
  async getAllByUser(userId: string) {
    const bookings = await bookingRepository.findAllByUserId(userId);

    return bookings;
  }

  async getBookedDatesByProduct(productId: string): Promise<string[]> {
    const bookings = await bookingRepository.findActiveByProductId(productId);

    const dates: Set<string> = new Set();
    for (const booking of bookings) {
      const checkPeriod = booking.check_period as {
        check_in: string;
        check_out: string;
      };
      if (!checkPeriod?.check_in || !checkPeriod?.check_out) continue;

      let current = new Date(checkPeriod.check_in);
      const end = new Date(checkPeriod.check_out);

      while (current < end) {
        const yyyy = current.getFullYear();
        const mm = String(current.getMonth() + 1).padStart(2, "0");
        const dd = String(current.getDate()).padStart(2, "0");
        dates.add(`${yyyy}-${mm}-${dd}`);
        current.setDate(current.getDate() + 1);
      }
    }

    return Array.from(dates);
  }

  async getHistoryByBookingId(bookingId: string, userId: string) {
    const booking = await bookingRepository.findById(bookingId);
    const user = await userRepository.findById(userId);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.role === "admin" && booking.adminId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to view this booking history",
      );
    }
    if (user.role === "user" && booking.userId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to view this booking history",
      );
    }
    const bookingHistories =
      await bookingRepository.findHistoryByBookingId(bookingId);

    const formattedBookingHistories = bookingHistories.map((bookingHistory) => {
      const { updatedAt, ...rest } = bookingHistory;
      return rest;
    });
    return {
      history: formattedBookingHistories,
      bookingStatus: booking.status,
    };
  }

  async respondToHistory(
    historyId: string,
    userId: string,
    files: Record<string, Express.Multer.File[]>,
  ) {
    const history = await bookingRepository.findHistoryById(historyId);

    if (!history) {
      throw new NotFoundError("Booking history not found");
    }

    if (history.hasUserResponded) {
      throw new BadRequestError("You have already responded to this history");
    }

    const booking = await bookingRepository.findById(history.bookingId);

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (booking.userId !== userId) {
      throw new ForbiddenError(
        "You do not have permission to respond to this booking history",
      );
    }

    if (booking.status !== "action_required" && booking.status !== "pending") {
      throw new BadRequestError(
        "This booking is not currently requiring action",
      );
    }

    const actionItems = (history.action_items as string[]) || [];

    const responseData: Record<string, any> = {};
    const uploadedFiles: { filePath: string }[] = [];

    try {
      if (actionItems.includes("valid_id")) {
        const validIdFile = files.valid_id;
        if (!validIdFile || validIdFile.length === 0) {
          throw new BadRequestError("Valid ID file is required.");
        }
        const uploaded = await uploadFileToSupabase(validIdFile[0], "userIds");
        uploadedFiles.push(uploaded);
        responseData.valid_id_url = uploaded.publicUrl;
      }

      if (actionItems.includes("security_deposit")) {
        const paymentProofFile = files.security_deposit;
        if (!paymentProofFile || paymentProofFile.length === 0) {
          throw new BadRequestError("Security deposit proof file is required.");
        }
        const uploaded = await uploadFileToSupabase(
          paymentProofFile[0],
          "paymentProofs",
        );
        uploadedFiles.push(uploaded);
        responseData.payment_proof_url = uploaded.publicUrl;
      }

      const userFirstName = booking.user?.first_name;
      const userLastName = booking.user?.last_name;

      const userName = userFirstName && userLastName;

      const ownerFirstName = booking.admin?.first_name;
      const ownerLastName = booking.admin?.last_name;

      const ownerName = ownerFirstName && ownerLastName;

      // Create a new history entry with the user's uploaded files
      await bookingRepository.createBookingHistory({
        userName: userName
          ? `${userFirstName} ${userLastName}`
          : userFirstName
            ? userFirstName
            : userLastName
              ? userLastName
              : "Deleted user",
        ownerName: ownerName
          ? `${ownerFirstName} ${ownerLastName}`
          : ownerFirstName
            ? ownerFirstName
            : ownerLastName
              ? ownerLastName
              : "Deleted user",
        // userName: `${booking?.user?.first_name} ${booking?.user?.last_name}`,
        // ownerName: `${booking?.admin?.first_name} ${booking.admin.last_name}`,
        booking: { connect: { id: booking.id } },
        hasUserResponded: true,
        action_items: [],
        ...responseData,
      });

      // Mark the original history item as responded
      await bookingRepository.updateBookingHistory(historyId, {
        hasUserResponded: true,
      });

      if (booking.status === "action_required") {
        await bookingRepository.update(booking.id, { status: "pending" });
      }

      return;
    } catch (error) {
      if (uploadedFiles.length > 0) {
        await supabase.storage
          .from("images")
          .remove(uploadedFiles.map((f) => f.filePath));
      }
      throw error;
    }
  }

  async getMyExistingBooking(userId: string) {
    const booking = await bookingRepository.findFirst({
      userId,
      status: { in: ["confirmed", "checked_in", "pending", "action_required"] },
    });

    if (!booking) {
      return null;
    }

    return {
      status: booking?.status ? booking.status : null,
      id: booking?.id ? booking.id : null,
    };
  }

  async getMyBookings(filter: {}, userId: string) {
    const bookings = await bookingRepository.findMany({ ...filter, userId });
    return bookings.map((booking) => booking.id);
  }
}

export const bookingService = new BookingService();
