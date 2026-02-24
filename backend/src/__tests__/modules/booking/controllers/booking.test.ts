import { bookingController } from "../../../../modules/booking/controllers/booking.controller";
import { bookingService } from "../../../../modules/booking/services/booking.service";

jest.mock("../../../../modules/booking/services/booking.service");

describe("BookingController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: {}, files: {}, user: { user_id: "u1" } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  it("createBooking calls service.create and returns 201", async () => {
    (bookingService.create as jest.Mock).mockResolvedValue(undefined);

    await bookingController.createBooking(req, res);

    expect(bookingService.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Booking successfully created",
    });
  });

  it("getAllBookingsAdmin returns bookings fetched from service", async () => {
    const bookings = [{ id: "b1" }];
    (bookingService.getAllByAdmin as jest.Mock).mockResolvedValue(bookings);

    await bookingController.getAllBookingsAdmin(req, res);

    expect(bookingService.getAllByAdmin).toHaveBeenCalledWith("u1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Bookings successfully fetched",
      bookings,
    });
  });
});
