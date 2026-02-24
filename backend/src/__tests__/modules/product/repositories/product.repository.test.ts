jest.mock("@prisma/client", () => {
  const productCreate = jest.fn();
  const productFindUnique = jest.fn();
  const productFindMany = jest.fn();
  const productUpdate = jest.fn();
  const productDelete = jest.fn();

  const photoFindMany = jest.fn();
  const photoCreate = jest.fn();
  const photoFindUnique = jest.fn();
  const photoUpdate = jest.fn();
  const photoDelete = jest.fn();

  const mockInstance = {
    product: {
      create: productCreate,
      findUnique: productFindUnique,
      findMany: productFindMany,
      update: productUpdate,
      delete: productDelete,
    },
    photo: {
      findMany: photoFindMany,
      create: photoCreate,
      findUnique: photoFindUnique,
      update: photoUpdate,
      delete: photoDelete,
    },
  };

  const PrismaClient = jest.fn().mockImplementation(() => mockInstance);

  return { PrismaClient, __mockInstance: mockInstance };
});

import { productRepository } from "../../../../modules/product/repositories/product.repository";
import { supabase } from "../../../../shared/lib/supabase";

describe("ProductRepository", () => {
  beforeEach(() => jest.clearAllMocks());

  it("create returns product", async () => {
    const { __mockInstance } = require("@prisma/client");
    const instance = __mockInstance;
    const p = { id: "p1", name: "n" };
    instance.product.create.mockResolvedValue(p);

    const res = await productRepository.create({} as any);

    expect(res).toEqual(p);
    expect(instance.product.create).toHaveBeenCalled();
  });

  it("findById returns null when not found", async () => {
    const { __mockInstance } = require("@prisma/client");
    const instance = __mockInstance;
    instance.product.findUnique.mockResolvedValue(null);

    const res = await productRepository.findById("nope");

    expect(res).toBeNull();
  });

  it("delete removes supabase photos and deletes product", async () => {
    const { __mockInstance } = require("@prisma/client");
    const instance = __mockInstance;

    const photos = [{ id: "ph1", image_url: "http://example.com/x.jpg" }];
    instance.photo.findMany.mockResolvedValue(photos);
    instance.product.delete.mockResolvedValue({ id: "p1" });

    const spy = jest.spyOn(supabase.storage, "from");

    const res = await productRepository.delete("p1");

    expect(instance.photo.findMany).toHaveBeenCalledWith({
      where: { productId: "p1" },
    });
    expect(instance.product.delete).toHaveBeenCalledWith({
      where: { id: "p1" },
    });
    spy.mockRestore();
  });
});
