import { bookingService } from "../../../../modules/booking/services/booking.service";
import { bookingRepository } from "../../../../modules/booking/repositories/bookings.repository";
import { productService } from "../../../../modules/product/services/product.service";
import { uploadFileToSupabase } from "../../../../shared/helpers/uploadFileToSupabase";
import {
  BadRequestError,
  NotFoundError,
} from "../../../../shared/helpers/appErrors";

jest.mock("../../../../modules/booking/repositories/bookings.repository");
jest.mock("../../../../modules/product/services/product.service");
jest.mock("../../../../shared/helpers/uploadFileToSupabase");

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
    (bookingRepository.create as jest.Mock).mockResolvedValue(undefined);

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
  });

  it("formats bookings returned by repository in getAllByAdmin", async () => {
    const raw = [
      { id: "b1", createdAt: new Date(), updatedAt: new Date(), foo: "bar" },
    ];
    (bookingRepository.findAllByAdminId as jest.Mock).mockResolvedValue(raw);

    const result = await bookingService.getAllByAdmin("a1");

    expect(result).toEqual([{ id: "b1", foo: "bar" }]);
  });
});
