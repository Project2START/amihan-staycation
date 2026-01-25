import { Request, Response } from "express";

export class ProductController {
  createProduct(req: Request, res: Response) {
    console.log(req.body);
    console.log(req.files);
  }
}

export const productController = new ProductController();
