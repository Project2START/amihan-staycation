import { productController } from "../../../../modules/product/controllers/product.controller";
import { productService } from "../../../../modules/product/services/product.service";

jest.mock("../../../../modules/product/services/product.service");

describe("ProductController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {},
      files: {},
      params: { id: "p1" },
      user: { user_id: "u1" },
      query: {},
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  it("createProduct returns created product", async () => {
    (productService.create as jest.Mock).mockResolvedValue({
      id: "p1",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "n",
    });

    await productController.createProduct(req, res);

    expect(productService.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it("getProduct returns 200 with product", async () => {
    const p = { id: "p1" };
    (productService.get as jest.Mock).mockResolvedValue(p);

    await productController.getProduct(req, res);

    expect(productService.get).toHaveBeenCalledWith("p1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Product successfully fetched",
      product: p,
    });
  });

  it("getProducts calls getAll", async () => {
    const arr: any[] = [];
    (productService.getAll as jest.Mock).mockResolvedValue(arr);

    await productController.getProducts(req, res);

    expect(productService.getAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("deleteProduct calls service.delete and returns 200", async () => {
    (productService.delete as jest.Mock).mockResolvedValue(undefined);

    await productController.deleteProduct(req, res);

    expect(productService.delete).toHaveBeenCalledWith("p1", "u1");
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
