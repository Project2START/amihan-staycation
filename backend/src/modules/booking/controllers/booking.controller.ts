import { Request, Response } from "express";
import { bookingService } from "../services/booking.service";

class BookingController {
  async updateBooking(req: Request, res: Response) {
    const admin = (req as any).user;
    const bookingId = req.params.id;
    const updateData = req.body;

    await bookingService.update(bookingId, admin.user_id, updateData);

    res.status(200).json({
      message: "Booking successfully updated",
    });
  }
  async createBooking(req: Request, res: Response) {
    const user = (req as any).user;

    await bookingService.create(
      req.body,
      req.files as Record<string, Express.Multer.File[]>,
      user.user_id,
    );

    res.status(201).json({
      message: "Booking successfully created",
    });
  }

  async getAllBookingsAdmin(req: Request, res: Response) {
    const user = (req as any).user;

    const bookings = await bookingService.getAllByAdmin(user.user_id);

    res
      .status(200)
      .json({ message: "Bookings successfully fetched", bookings });
  }

  async getAllBookingsUser(req: Request, res: Response) {
    const user = (req as any).user;

    const bookings = await bookingService.getAllByUser(user.user_id);

    const mapped = bookings.map((b) => ({
      id: b.id,
      name: b.name,
      contact_number: b.contact_number,
      check_period: b.check_period,
      status: b.status,
      product: { name: b?.product?.name },
      createdAt: b.createdAt,
    }));

    res
      .status(200)
      .json({ message: "Bookings successfully fetched", bookings: mapped });
  }

  async getBookingHistory(req: Request, res: Response) {
    const user = (req as any).user;
    const bookingId = req.params.id;

    const { history, bookingStatus } =
      await bookingService.getHistoryByBookingId(bookingId, user.user_id);

    res.status(200).json({
      message: "Booking history successfully fetched",
      history,
      bookingStatus,
    });
  }

  async respondToHistory(req: Request, res: Response) {
    const user = (req as any).user;
    const { historyId } = req.body;

    await bookingService.respondToHistory(
      historyId,
      user.user_id,
      req.files as Record<string, Express.Multer.File[]>,
    );

    res.status(200).json({
      message: "Response submitted successfully",
    });
  }

  async getMyBookings(req: Request, res: Response) {
    const user = (req as any).user;

    const { service } = req.query;

    if (service === "existingBooking") {
      const booking = await bookingService.getMyExistingBooking(user.user_id);

      res.status(200).json({
        booking,
      });

      return;
    }

    const bookings = await bookingService.getMyBookings({}, user.user_id);

    res
      .status(200)
      .json({ message: "Bookings successfully fetched", bookings });
  }
}

export const bookingController = new BookingController();
