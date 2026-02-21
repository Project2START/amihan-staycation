import { Request } from "express";

class BookingController {
  async create(req: Request, res: Response) {
    console.log(req.body);

    console.log(req.files);
  }
}

export const bookingController = new BookingController();
