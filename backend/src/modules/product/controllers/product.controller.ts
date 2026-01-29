import { Request, Response } from "express";
import { productService } from "../services/product.service";

interface RequestWithFiles extends Request {
  files?: any;
}

export class ProductController {
  async createProduct(req: RequestWithFiles, res: Response) {
    const product = await productService.create(req.body, req.files);

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

  async getProducts(_: RequestWithFiles, res: Response) {
    const products = await productService.getAll();

    res.status(200).json({
      message: "Products successfully fetched",
      products,
    });
  }
}

export const productController = new ProductController();
