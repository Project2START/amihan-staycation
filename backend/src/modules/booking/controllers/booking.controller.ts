import { Request, Response } from "express";
import { bookingService } from "../services/booking.service";

class BookingController {
  async create(req: Request, res: Response) {
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
}

export const bookingController = new BookingController();
