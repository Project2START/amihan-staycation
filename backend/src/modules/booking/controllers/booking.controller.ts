import { Request, Response } from "express";
import { bookingService } from "../services/booking.service";

class BookingController {
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
}

export const bookingController = new BookingController();
