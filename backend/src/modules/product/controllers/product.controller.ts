import { Request, Response } from "express";
import { productService } from "../services/product.service";

interface RequestWithFiles extends Request {
  files?: any;
}

class ProductController {
  async createProduct(req: RequestWithFiles, res: Response) {
    const user = (req as any).user;
    const product = await productService.create(
      req.body,
      req.files,
      user.user_id,
    );

    const { createdAt, updatedAt, ...rest } = product;
    res.status(201).json({
      message: "Product successfully created",
      product: rest,
    });
  }
  async getProduct(req: Request, res: Response) {
    const { id } = req.params;

    const product = await productService.get(id);

    res.status(200).json({
      message: "Product successfully fetched",
      product,
    });
  }

  async getProducts(req: Request, res: Response) {
    const user = (req as any).user;

    const checkIn =
      typeof req.query.checkIn === "string" ? req.query.checkIn : undefined;
    const checkOut =
      typeof req.query.checkOut === "string" ? req.query.checkOut : undefined;
    const adults =
      typeof req.query.adults === "string"
        ? Number(req.query.adults)
        : undefined;
    const children =
      typeof req.query.children === "string"
        ? Number(req.query.children)
        : undefined;

    const products = await productService.getAll(
      user?.user_role,
      user?.user_id,
      {
        checkIn,
        checkOut,
        adults: Number.isFinite(adults) ? adults : undefined,
        children: Number.isFinite(children) ? children : undefined,
      },
    );

    res.status(200).json({
      message: "Products successfully fetched",
      products,
    });
  }
  async getProductsById(req: Request, res: Response) {
    const user = (req as any).user;

    const products = await productService.getAllById(user.user_id);

    res.status(200).json({
      message: "Products successfully fetched",
      products,
    });
  }
  async updateProduct(req: RequestWithFiles, res: Response) {
    const user = (req as any).user;

    await productService.update(req.body, req.files, user.user_id);

    res.status(200).json({
      message: "Product successfully updated",
    });
  }
  async deleteProduct(req: Request, res: Response) {
    const user = (req as any).user;

    const { id } = req.params;

    await productService.delete(id, user.user_id);

    res.status(200).json({ message: "Unit product successfully deleted" });
  }
}

export const productController = new ProductController();
