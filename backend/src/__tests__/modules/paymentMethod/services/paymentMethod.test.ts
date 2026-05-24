import { paymentMethodService } from "../../../../modules/paymentMethod/services/paymentMethod.service";
import { paymentMethodRepository } from "../../../../modules/paymentMethod/repositories/paymentMethod.repository";
import { supabase } from "../../../../shared/lib/supabase";
import { generateFilePath } from "../../../../shared/helpers/generators/generateFilePath";
import { productService } from "../../../../modules/product/services/product.service";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../../../../shared/helpers/appErrors";

jest.mock(
  "../../../../modules/paymentMethod/repositories/paymentMethod.repository",
);
jest.mock("../../../../shared/lib/supabase");
jest.mock("../../../../shared/helpers/generators/generateFilePath");
jest.mock("../../../../modules/product/services/product.service");

describe("PaymentMethodService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("throws BadRequestError when qr_code missing", async () => {
    await expect(
      paymentMethodService.create({} as any, undefined as any, "u1"),
    ).rejects.toThrow(BadRequestError);
  });

  it("creates payment method when upload succeeds", async () => {
    (generateFilePath as jest.Mock).mockReturnValue("path1");
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: jest.fn().mockResolvedValue({ error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: "pu" } }),
    });
    (paymentMethodRepository.create as jest.Mock).mockResolvedValue(undefined);

    const qr = { buffer: Buffer.from(""), mimetype: "image/png" } as any;

    await expect(
      paymentMethodService.create(
        { account_name: "a", account_number: "n", payment_method: "pm" } as any,
        qr,
        "u1",
      ),
    ).resolves.toBeUndefined();

    expect(paymentMethodRepository.create).toHaveBeenCalled();
  });

  it("get throws NotFoundError when repository returns null", async () => {
    (paymentMethodRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(paymentMethodService.get("p1", "u1")).rejects.toThrow(
      NotFoundError,
    );
  });

  it("get throws ForbiddenError when userId mismatches", async () => {
    (paymentMethodRepository.findById as jest.Mock).mockResolvedValue({
      id: "p1",
      userId: "other",
    });

    await expect(paymentMethodService.get("p1", "u1")).rejects.toThrow(
      ForbiddenError,
    );
  });

  it("getAllByProductId throws NotFoundError when product missing", async () => {
    (productService.get as jest.Mock).mockResolvedValue(null);

    await expect(
      paymentMethodService.getAllByProductId("prod1"),
    ).rejects.toThrow(NotFoundError);
  });
});
