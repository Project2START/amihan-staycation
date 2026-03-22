import { bookingService } from "../../../../modules/booking/services/booking.service";
import { bookingRepository } from "../../../../modules/booking/repositories/bookings.repository";
import { productService } from "../../../../modules/product/services/product.service";
import { uploadFileToSupabase } from "../../../../shared/helpers/uploadFileToSupabase";
import { notificationRepository } from "../../../../modules/notification/repositories/notification.repository";
import {
  BadRequestError,
  NotFoundError,
} from "../../../../shared/helpers/appErrors";
import { io } from "../../../../app";

jest.mock("../../../../modules/booking/repositories/bookings.repository");
jest.mock("../../../../modules/product/services/product.service");
jest.mock("../../../../shared/helpers/uploadFileToSupabase");
jest.mock(
  "../../../../modules/notification/repositories/notification.repository",
);
jest.mock("../../../../shared/helpers/notifyUser", () => ({
  notifyUser: jest.fn(),
}));
jest.mock("../../../../app", () => ({
  io: {
    to: jest.fn(() => ({
      emit: jest.fn(),
    })),
  },
}));

describe("BookingService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("throws NotFoundError when product does not exist", async () => {
    (productService.get as jest.Mock).mockResolvedValue(null);

    await expect(
      bookingService.create({ product_id: "p1" } as any, {} as any, "u1"),
    ).rejects.toThrow(NotFoundError);
  });

  it("throws BadRequestError when payment_proof missing", async () => {
    (productService.get as jest.Mock).mockResolvedValue({
      id: "p1",
      userId: "a1",
    });

    const files = { valid_id: [{} as any] };

    await expect(
      bookingService.create({ product_id: "p1" } as any, files as any, "u1"),
    ).rejects.toThrow(BadRequestError);
  });

  it("creates booking successfully when files and product exist", async () => {
    (productService.get as jest.Mock).mockResolvedValue({
      id: "p1",
      userId: "a1",
    });
    (uploadFileToSupabase as jest.Mock).mockResolvedValue({
      publicUrl: "pu1",
      filePath: "fp1",
    });
    (bookingRepository.create as jest.Mock).mockResolvedValue({
      id: "b1",
      userId: "u1",
      adminId: "a1",
    });
    (notificationRepository.create as jest.Mock).mockResolvedValue(undefined);
    (
      notificationRepository.countUnreadByDestination as jest.Mock
    ).mockResolvedValue(0);

    const files = {
      valid_id: [{ originalname: "id.jpg" } as any],
      payment_proof: [{ originalname: "proof.jpg" } as any],
    } as any;

    await expect(
      bookingService.create(
        { product_id: "p1", name: "n" } as any,
        files,
        "u1",
      ),
    ).resolves.toBeUndefined();

    expect(bookingRepository.create).toHaveBeenCalled();
    expect(notificationRepository.create).toHaveBeenCalled();
    expect(io.to).toHaveBeenCalled();
  });

  it("sorts bookings returned by repository in getAllByAdmin", async () => {
    const raw = [
      {
        id: "b1",
        status: "pending",
        check_period: { check_in: "2026-03-25", check_out: "2026-03-26" },
        createdAt: new Date("2026-03-20T10:00:00.000Z"),
      },
      {
        id: "b2",
        status: "action_required",
        check_period: { check_in: "2026-03-26", check_out: "2026-03-27" },
        createdAt: new Date("2026-03-21T10:00:00.000Z"),
      },
      {
        id: "b3",
        status: "pending",
        check_period: { check_in: "2026-03-24", check_out: "2026-03-25" },
        createdAt: new Date("2026-03-19T10:00:00.000Z"),
      },
    ];
    (bookingRepository.findAllByAdminId as jest.Mock).mockResolvedValue(raw);

    const result = await bookingService.getAllByAdmin("a1");

    expect(result.map((booking) => booking.id)).toEqual(["b2", "b3", "b1"]);
  });
});
