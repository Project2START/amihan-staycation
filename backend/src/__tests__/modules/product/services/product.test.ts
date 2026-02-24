import { productService } from "../../../../modules/product/services/product.service";
import { productRepository } from "../../../../modules/product/repositories/product.repository";
import { supabase } from "../../../../shared/lib/supabase";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../../../../shared/helpers/appErrors";

jest.mock("../../../../modules/product/repositories/product.repository");
jest.mock("../../../../shared/lib/supabase");

describe("ProductService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("throws BadRequestError when photos missing on create", async () => {
    await expect(
      productService.create({ name: "n" } as any, [] as any, "u1"),
    ).rejects.toThrow(BadRequestError);
  });

  it("get throws NotFoundError when product not found", async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue(null);

    await expect(productService.get("p1")).rejects.toThrow(NotFoundError);
  });

  it("delete throws ForbiddenError when userId mismatches", async () => {
    (productRepository.findById as jest.Mock).mockResolvedValue({
      id: "p1",
      userId: "other",
    });

    await expect(productService.delete("p1", "u1")).rejects.toThrow(
      ForbiddenError,
    );
  });

  it("getAll returns mapped products", async () => {
    (productRepository.findAll as jest.Mock).mockResolvedValue([
      { id: "p1", createdAt: new Date(), updatedAt: new Date(), foo: "bar" },
    ]);

    const res = await productService.getAll();

    expect(res).toEqual([{ id: "p1", foo: "bar" }]);
  });
});
