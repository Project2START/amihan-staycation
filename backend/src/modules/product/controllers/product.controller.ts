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

    // console.log(req.body);
    // console.log(req.body.name);
    // console.log(req.files);
  }
}

export const productController = new ProductController();
