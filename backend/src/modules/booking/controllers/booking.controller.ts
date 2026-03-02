import { Request, Response } from "express";
import { bookingService } from "../services/booking.service";

class BookingController {
  async updateBooking(req: Request, res: Response) {
    const admin = (req as any).user;
    const bookingId = req.params.id;
    const updateData = req.body;

    console.log(updateData);

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
}

export const bookingController = new BookingController();
